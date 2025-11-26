/**
 * Script para deletar a coleção "items" antiga após migração
 * 
 * ⚠️ USE APENAS APÓS VERIFICAR QUE A MIGRAÇÃO FOI BEM-SUCEDIDA!
 * 
 * Uso:
 * node delete-old-items-collection.js
 */

const admin = require('firebase-admin');
const path = require('path');
const readline = require('readline');

const serviceAccountPath = path.join(__dirname, 'firebase-credentials.json');

let serviceAccount;
try {
  serviceAccount = require(serviceAccountPath);
} catch (error) {
  console.error('❌ Erro: arquivo firebase-credentials.json não encontrado!');
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// Criar interface para leitura de entrada
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function deleteOldItemsCollection() {
  // Confirmação antes de deletar
  rl.question(
    '⚠️  Tem certeza que deseja DELETAR a coleção "items" antiga? (digite "sim" para confirmar): ',
    async (answer) => {
      if (answer.toLowerCase() !== 'sim') {
        console.log('❌ Operação cancelada.');
        rl.close();
        await admin.app().delete();
        process.exit(0);
      }

      console.log('\n🚀 Iniciando deleção da coleção "items" antiga...\n');

      try {
        const storesSnapshot = await db.collection('stores').get();

        if (storesSnapshot.empty) {
          console.log('⚠️  Nenhuma store encontrada.');
          process.exit(0);
        }

        let totalDeleted = 0;

        for (const storeDoc of storesSnapshot.docs) {
          const storeId = storeDoc.id;
          console.log(`\n📍 Processando store: ${storeId}`);

          const itemsSnapshot = await db
            .collection('stores')
            .doc(storeId)
            .collection('items')
            .get();

          if (itemsSnapshot.empty) {
            console.log(`  ⏭️  Nenhum item antigo encontrado em stores/${storeId}/items`);
            continue;
          }

          const itemsCount = itemsSnapshot.size;
          console.log(`  🗑️  Deletando ${itemsCount} item(s)...`);

          let deletedCount = 0;

          for (const itemDoc of itemsSnapshot.docs) {
            try {
              await db
                .collection('stores')
                .doc(storeId)
                .collection('items')
                .doc(itemDoc.id)
                .delete();

              deletedCount++;
            } catch (error) {
              console.error(`    ❌ Erro ao deletar ${itemDoc.id}:`, error.message);
            }
          }

          console.log(`  ✅ ${deletedCount}/${itemsCount} itens deletados`);
          totalDeleted += deletedCount;
        }

        console.log(`\n✨ Deleção concluída! Total: ${totalDeleted} itens removidos`);
        console.log('✅ A migração foi concluída com sucesso!');
      } catch (error) {
        console.error('❌ Erro durante a deleção:', error);
        process.exit(1);
      } finally {
        rl.close();
        await admin.app().delete();
      }
    }
  );
}

deleteOldItemsCollection();
