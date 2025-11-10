/**
 * Script de Migração: Transferir itens de "items" para "itens"
 * 
 * Use este script para migrar os dados do Firebase de:
 * stores/{storeId}/items -> stores/{storeId}/itens
 * 
 * Instalação das dependências:
 * npm install firebase-admin
 * 
 * Uso:
 * node migrate-items-to-itens.mjs
 */

import admin from 'firebase-admin';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Caminho para o arquivo de credenciais do Firebase
// Baixe o arquivo JSON das credenciais em: Firebase Console > Project Settings > Service Accounts
const serviceAccountPath = join(__dirname, 'firebase-credentials.json');

// Inicializar Firebase Admin
let serviceAccount;
try {
  const fileContent = readFileSync(serviceAccountPath, 'utf8');
  serviceAccount = JSON.parse(fileContent);
} catch (error) {
  console.error('❌ Erro: arquivo firebase-credentials.json não encontrado!');
  console.error('Passos para obter o arquivo:');
  console.error('1. Vá para Firebase Console');
  console.error('2. Clique em Project Settings (engrenagem no topo)');
  console.error('3. Vá para a aba "Service Accounts"');
  console.error('4. Clique em "Generate New Private Key"');
  console.error('5. Salve o arquivo como firebase-credentials.json na raiz do projeto');
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

async function migrateItems() {
  console.log('🚀 Iniciando migração de items para itens...\n');

  try {
    // Obter todas as stores
    const storesSnapshot = await db.collection('stores').get();

    if (storesSnapshot.empty) {
      console.log('⚠️  Nenhuma store encontrada no Firestore.');
      process.exit(0);
    }

    console.log(`📦 Encontradas ${storesSnapshot.size} store(s)\n`);

    let totalItemsMigrados = 0;

    // Para cada store
    for (const storeDoc of storesSnapshot.docs) {
      const storeId = storeDoc.id;
      console.log(`\n📍 Processando store: ${storeId}`);

      // Verificar se a coleção "items" existe
      const itemsSnapshot = await db.collection('stores').doc(storeId).collection('items').get();

      if (itemsSnapshot.empty) {
        console.log(`  ⏭️  Nenhum item encontrado em stores/${storeId}/items`);
        continue;
      }

      const itemsCount = itemsSnapshot.size;
      console.log(`  📄 Encontrados ${itemsCount} item(s) para migrar`);

      let migratedCount = 0;

      // Transferir cada item
      for (const itemDoc of itemsSnapshot.docs) {
        try {
          const itemData = itemDoc.data();
          
          // Salvar em "itens"
          await db
            .collection('stores')
            .doc(storeId)
            .collection('itens')
            .doc(itemDoc.id)
            .set(itemData);

          console.log(`    ✅ Migrado: ${itemData.nome || itemDoc.id}`);
          migratedCount++;
        } catch (error) {
          console.error(`    ❌ Erro ao migrar item ${itemDoc.id}:`, error.message);
        }
      }

      console.log(`  ✨ ${migratedCount}/${itemsCount} itens migrados com sucesso`);
      totalItemsMigrados += migratedCount;

      // Perguntar se deseja deletar a coleção antiga
      if (migratedCount === itemsCount) {
        console.log(`  🗑️  Todos os itens foram migrados para "itens"`);
        console.log(`  ⚠️  Para deletar a coleção "items" antiga, execute:\n`);
        console.log(`     node delete-old-items-collection.mjs\n`);
      }
    }

    console.log(`\n✅ Migração concluída! Total: ${totalItemsMigrados} itens transferidos`);
  } catch (error) {
    console.error('❌ Erro durante a migração:', error);
    process.exit(1);
  } finally {
    await admin.app().delete();
  }
}

// Executar migração
migrateItems().catch(error => {
  console.error('Erro fatal:', error);
  process.exit(1);
});
