/**
 * Script de Migração: Transferir itens de "items" para "itens" para uma store específica
 */

import admin from 'firebase-admin';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';

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

async function migrateSpecificStore() {
  const storeId = '0dhK7bfadVRXEDPn1SG25XnyAjB2';
  
  console.log('🚀 Iniciando migração para store específica...\n');
  console.log(`📍 Store ID: ${storeId}\n`);

  try {
    // Obter todos os items
    const itemsSnapshot = await db
      .collection('stores')
      .doc(storeId)
      .collection('items')
      .get();

    if (itemsSnapshot.empty) {
      console.log('⚠️  Nenhum item encontrado em stores/' + storeId + '/items');
      process.exit(0);
    }

    const itemsCount = itemsSnapshot.size;
    console.log(`📄 Encontrados ${itemsCount} item(s) para migrar\n`);

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

        console.log(`✅ Migrado: ${itemData.nome || itemDoc.id}`);
        migratedCount++;
      } catch (error) {
        console.error(`❌ Erro ao migrar item ${itemDoc.id}:`, error.message);
      }
    }

    console.log(`\n✨ ${migratedCount}/${itemsCount} itens migrados com sucesso`);
    
    if (migratedCount === itemsCount) {
      console.log(`\n🎉 Migração concluída! Todos os itens foram transferidos para "itens"`);
    }
  } catch (error) {
    console.error('❌ Erro durante a migração:', error);
    process.exit(1);
  } finally {
    await admin.app().delete();
  }
}

// Executar migração
migrateSpecificStore().catch(error => {
  console.error('Erro fatal:', error);
  process.exit(1);
});
