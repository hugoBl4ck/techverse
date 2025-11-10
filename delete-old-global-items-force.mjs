/**
 * Script para deletar a coleção global "itens" antiga (sem confirmação)
 * 
 * ⚠️ USE APENAS APÓS VERIFICAR QUE A MIGRAÇÃO FOI BEM-SUCEDIDA!
 * 
 * Uso:
 * node delete-old-global-items-force.mjs
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

async function deleteOldGlobalItems() {
  console.log('🚀 Script de Deleção da Coleção Global "itens" (sem confirmação)\n');

  try {
    const itemsSnapshot = await db.collection('itens').get();

    if (itemsSnapshot.empty) {
      console.log('⚠️  Nenhum item encontrado na coleção "itens".');
      await admin.app().delete();
      process.exit(0);
    }

    const itemsCount = itemsSnapshot.size;
    console.log(`🗑️  Deletando ${itemsCount} item(s)...\n`);

    let deletedCount = 0;

    for (const itemDoc of itemsSnapshot.docs) {
      try {
        await db.collection('itens').doc(itemDoc.id).delete();

        const itemName = itemDoc.data().nome || itemDoc.id;
        console.log(`✅ Deletado: ${itemName}`);
        deletedCount++;
      } catch (error) {
        console.error(`❌ Erro ao deletar ${itemDoc.id}:`, error.message);
      }
    }

    console.log(`\n✨ Deleção concluída! ${deletedCount}/${itemsCount} itens removidos`);
    console.log('✅ Migração finalizada com sucesso!');

    await admin.app().delete();
  } catch (error) {
    console.error('❌ Erro durante a deleção:', error);
    process.exit(1);
  }
}

deleteOldGlobalItems();
