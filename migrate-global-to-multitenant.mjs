/**
 * Script de Migração: Transferir itens da coleção global "itens" para "stores/{storeId}/itens"
 * 
 * Este script migra itens de:
 * itens -> stores/{storeId}/itens
 * 
 * Uso:
 * node migrate-global-to-multitenant.mjs
 */

import admin from 'firebase-admin';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';
import process from 'process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const serviceAccountPath = join(__dirname, 'firebase-credentials.json');

let serviceAccount;
try {
  const fileContent = readFileSync(serviceAccountPath, 'utf8');
  serviceAccount = JSON.parse(fileContent);
} catch (error) {
  console.error('❌ Erro: arquivo firebase-credentials.json não encontrado!');
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

async function migrateGlobalToMultiTenant() {
  console.log('🚀 Iniciando migração de coleção global para multi-tenant...\n');

  try {
    // Obter todas as stores
    const storesSnapshot = await db.collection('stores').get();

    if (storesSnapshot.empty) {
      console.log('❌ Erro: Nenhuma store encontrada no Firestore.');
      console.log('⚠️  Você precisa ter pelo menos uma store criada.');
      process.exit(1);
    }

    console.log(`📦 Encontradas ${storesSnapshot.size} store(s):\n`);

    let storeIndex = 0;
    let selectedStoreId = null;

    for (const storeDoc of storesSnapshot.docs) {
      console.log(`   ${storeIndex + 1}. ${storeDoc.id}`);
      if (storeIndex === 0) {
        selectedStoreId = storeDoc.id;
      }
      storeIndex++;
    }

    console.log(`\n✅ Usando a primeira store: ${selectedStoreId}\n`);

    // Obter itens da coleção global
    console.log('📄 Buscando itens da coleção global "itens"...');
    const globalItensSnapshot = await db.collection('itens').get();

    if (globalItensSnapshot.empty) {
      console.log('⚠️  Nenhum item encontrado na coleção global "itens".');
      await admin.app().delete();
      process.exit(0);
    }

    const itemsCount = globalItensSnapshot.size;
    console.log(`   📊 Encontrados ${itemsCount} itens\n`);

    console.log(`🔄 Migrando ${itemsCount} itens para stores/${selectedStoreId}/itens...\n`);

    let migratedCount = 0;

    for (const itemDoc of globalItensSnapshot.docs) {
      try {
        const itemData = itemDoc.data();

        // Salvar em stores/{storeId}/itens
        await db
          .collection('stores')
          .doc(selectedStoreId)
          .collection('itens')
          .doc(itemDoc.id)
          .set(itemData);

        console.log(`✅ Migrado: ${itemData.nome || itemDoc.id}`);
        migratedCount++;
      } catch (error) {
        console.error(`❌ Erro ao migrar item ${itemDoc.id}:`, error.message);
      }
    }

    console.log(`\n✨ Migração concluída! ${migratedCount}/${itemsCount} itens transferidos`);

    if (migratedCount === itemsCount) {
      console.log(`\n🗑️  Todos os itens foram migrados com sucesso!`);
      console.log(`\n⚠️  Para deletar a coleção "itens" antiga, execute:\n`);
      console.log(`   node delete-old-global-items.mjs\n`);
    }

    await admin.app().delete();
  } catch (error) {
    console.error('❌ Erro:', error.message);
    process.exit(1);
  }
}

migrateGlobalToMultiTenant();
