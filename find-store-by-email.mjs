/**
 * Script para encontrar o ID da loja por e-mail
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

async function findStoreByEmail(email) {
  console.log(`🔍 Buscando loja para o e-mail: ${email}\n`);

  try {
    // Buscar nas stores
    const storesSnapshot = await db.collection('stores').get();

    let found = false;

    for (const storeDoc of storesSnapshot.docs) {
      const storeData = storeDoc.data();
      
      if (storeData.email === email || storeData.ownerEmail === email) {
        console.log(`✅ Loja encontrada!`);
        console.log(`   ID da loja: ${storeDoc.id}`);
        console.log(`   Nome: ${storeData.name || storeData.storeName || 'N/A'}`);
        console.log(`   E-mail: ${storeData.email || storeData.ownerEmail || 'N/A'}`);
        found = true;
      }
    }

    if (!found) {
      console.log(`❌ Nenhuma loja encontrada para o e-mail: ${email}`);
      console.log(`\n📋 Lojas cadastradas:`);
      
      storesSnapshot.docs.forEach(doc => {
        const data = doc.data();
        console.log(`   - ID: ${doc.id}, E-mail: ${data.email || data.ownerEmail || 'N/A'}`);
      });
    }
  } catch (error) {
    console.error('❌ Erro ao buscar:', error);
  } finally {
    await admin.app().delete();
  }
}

// Executar
const email = process.argv[2] || 'hugovieira.eng@gmail.com';
findStoreByEmail(email);
