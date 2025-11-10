/**
 * Script para criar o mapeamento de usuário em /users/{uid}
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

async function createUserMapping() {
  const uid = '0dhK7bfadVRXEDPn1SG25XnyAjB2';
  const email = 'hugovieira.eng@gmail.com';
  const storeId = '0dhK7bfadVRXEDPn1SG25XnyAjB2';

  console.log('🚀 Criando mapeamento de usuário...\n');
  console.log(`UID: ${uid}`);
  console.log(`Email: ${email}`);
  console.log(`StoreId: ${storeId}\n`);

  try {
    await db.collection('users').doc(uid).set({
      uid: uid,
      email: email,
      storeId: storeId,
      createdAt: new Date(),
    }, { merge: true });

    console.log('✅ Mapeamento criado com sucesso!');
    console.log(`✨ Documento criado em: /users/${uid}`);
  } catch (error) {
    console.error('❌ Erro ao criar mapeamento:', error);
    process.exit(1);
  } finally {
    await admin.app().delete();
  }
}

createUserMapping().catch(error => {
  console.error('Erro fatal:', error);
  process.exit(1);
});
