/**
 * Script para deletar a coleção global "itens" antiga após migração
 * 
 * ⚠️ USE APENAS APÓS VERIFICAR QUE A MIGRAÇÃO FOI BEM-SUCEDIDA!
 * 
 * Uso:
 * node delete-old-global-items.mjs
 * 
 * Ou para confirmar automaticamente:
 * echo "sim" | node delete-old-global-items.mjs
 */

import admin from 'firebase-admin';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';
import readline from 'readline';

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

async function askConfirmation(question) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.toLowerCase() === 'sim');
    });
  });
}

async function deleteOldGlobalItems() {
  console.log('🚀 Script de Deleção da Coleção Global "itens"\n');

  // Confirmação antes de deletar
  const confirmed = await askConfirmation(
    '⚠️  Tem certeza que deseja DELETAR a coleção global "itens"? (digite "sim" para confirmar): '
  );

  if (!confirmed) {
    console.log('❌ Operação cancelada.');
    await admin.app().delete();
    process.exit(0);
  }

  console.log('\n🚀 Iniciando deleção da coleção "itens"...\n');

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
