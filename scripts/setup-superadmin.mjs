import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';

// Sua configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBL6_VKGKWJOl13WGhw0gDYZYtHmLN4c7I",
  authDomain: "techverse-39ca6.firebaseapp.com",
  projectId: "techverse-39ca6",
  storageBucket: "techverse-39ca6.appspot.com",
  messagingSenderId: "645929070652",
  appId: "1:645929070652:web:e11a45caa0c6a4e5e27c5d"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function setSuperAdmin(email) {
  try {
    console.log(`Procurando usuário com email: ${email}...`);
    
    // Procura o usuário pelo email
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('email', '==', email));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      console.error('❌ Usuário não encontrado com esse email!');
      process.exit(1);
    }
    
    const userDoc = querySnapshot.docs[0];
    const userId = userDoc.id;
    const userData = userDoc.data();
    
    console.log(`✅ Usuário encontrado!`);
    console.log(`ID: ${userId}`);
    console.log(`Email: ${userData.email}`);
    console.log(`Nome: ${userData.nome || 'N/A'}`);
    
    // Atualiza o campo isSuperAdmin
    const userDocRef = doc(db, 'users', userId);
    await updateDoc(userDocRef, {
      isSuperAdmin: true
    });
    
    console.log(`✅ Campo 'isSuperAdmin' foi definido como TRUE`);
    console.log(`\n🎉 Sucesso! ${email} agora é um SUPERADMIN`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro:', error.message);
    process.exit(1);
  }
}

// Executar
setSuperAdmin('hugovieira.eng@gmail.com');
