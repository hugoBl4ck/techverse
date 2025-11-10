/**
 * Script para verificar onde estão os itens no Firebase
 * 
 * Uso:
 * node check-items-location.mjs
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

async function checkItemsLocation() {
  console.log('🔍 Verificando localização dos itens no Firebase...\n');

  try {
    // Verificar coleção global "itens"
    console.log('1️⃣  Checando coleção global "itens"...');
    const globalItensSnapshot = await db.collection('itens').get();
    console.log(`   📊 Encontrados: ${globalItensSnapshot.size} itens\n`);

    if (globalItensSnapshot.size > 0) {
      console.log('   📝 Exemplos:');
      let count = 0;
      for (const doc of globalItensSnapshot.docs) {
        if (count >= 3) break;
        console.log(`      - ${doc.data().nome || 'Sem nome'} (ID: ${doc.id})`);
        count++;
      }
      if (globalItensSnapshot.size > 3) {
        console.log(`      ... e mais ${globalItensSnapshot.size - 3} itens`);
      }
    }

    // Verificar stores
    console.log('\n2️⃣  Checando estrutura multi-tenant...');
    const storesSnapshot = await db.collection('stores').get();
    console.log(`   📊 Encontradas: ${storesSnapshot.size} store(s)\n`);

    for (const storeDoc of storesSnapshot.docs) {
      const storeId = storeDoc.id;
      console.log(`   📍 Store: ${storeId}`);

      // Verificar coleção "items"
      const itemsSnapshot = await db
        .collection('stores')
        .doc(storeId)
        .collection('items')
        .get();
      console.log(`      - stores/${storeId}/items: ${itemsSnapshot.size} itens`);

      // Verificar coleção "itens"
      const itensSnapshot = await db
        .collection('stores')
        .doc(storeId)
        .collection('itens')
        .get();
      console.log(`      - stores/${storeId}/itens: ${itensSnapshot.size} itens`);

      if (itensSnapshot.size > 0) {
        console.log('        📝 Exemplos:');
        let count = 0;
        for (const doc of itensSnapshot.docs) {
          if (count >= 3) break;
          console.log(`           - ${doc.data().nome || 'Sem nome'} (ID: ${doc.id})`);
          count++;
        }
        if (itensSnapshot.size > 3) {
          console.log(`           ... e mais ${itensSnapshot.size - 3} itens`);
        }
      }
    }

    console.log('\n✅ Verificação concluída!');
  } catch (error) {
    console.error('❌ Erro durante verificação:', error);
    process.exit(1);
  } finally {
    await admin.app().delete();
  }
}

checkItemsLocation();
