import { initializeApp } from 'firebase/app'
import { getFirestore, collection, addDoc, Timestamp } from 'firebase/firestore'
import dotenv from 'dotenv'

dotenv.config()

const firebaseConfig = {
    apiKey: process.env.VITE_FIREBASE_API_KEY,
    authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.VITE_FIREBASE_APP_ID
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

/**
 * Adiciona uma nova promoção ao Firestore
 * 
 * COMO USAR:
 * 1. Edite os campos abaixo com as informações do produto
 * 2. Execute: node scripts/add-promo.mjs
 */
async function addPromo() {
    // ============================================
    // EDITE AQUI COM AS INFORMAÇÕES DO SEU PRODUTO
    // ============================================

    const promo = {
        // INFORMAÇÕES BÁSICAS
        titulo: "Mouse Gamer RGB Logitech G502 HERO",
        descricao: "Mouse gamer de alta performance com sensor HERO 25K DPI, 11 botões programáveis, iluminação RGB LIGHTSYNC e design ergonômico. Ideal para jogos competitivos como CS:GO, Valorant e trabalho profissional.",

        // TIPO E LINK
        tipo: "afiliado",  // "afiliado" para links externos, "interna" para produtos da loja
        link: "https://amzn.to/3KnjeQm",  // SEU LINK DE AFILIADO AQUI

        // DATAS (formato: ano, mês-1, dia, hora, minuto, segundo)
        dataInicio: Timestamp.fromDate(new Date('2025-11-26')),  // Data de início
        dataFim: Timestamp.fromDate(new Date('2025-12-31')),     // Data de fim
        createdAt: Timestamp.now(),

        // PREÇOS E DESCONTO
        desconto: 30,              // Percentual de desconto
        precoOriginal: 399.90,     // Preço original
        precoPromocional: 279.90,  // Preço com desconto

        // IMAGENS (URLs das fotos do produto)
        fotos: [
            "https://m.media-amazon.com/images/I/61mpMH5TzkL._AC_SL1500_.jpg"
        ],

        // CONFIGURAÇÕES
        destaque: true,           // true = aparece em destaque no topo
        categoria: "Periféricos", // Hardware, Periféricos, Componentes, etc.
        ativo: true              // true = promoção ativa
    }

    // ============================================
    // NÃO EDITE ABAIXO DESTA LINHA
    // ============================================

    try {
        console.log('📦 Adicionando promoção ao Firestore...')
        console.log('📝 Título:', promo.titulo)
        console.log('🔗 Link:', promo.link)
        console.log('💰 Desconto:', promo.desconto + '%')
        console.log('')

        const docRef = await addDoc(collection(db, 'promos'), promo)

        console.log('✅ Promoção adicionada com sucesso!')
        console.log('🆔 ID do documento:', docRef.id)
        console.log('')
        console.log('🌐 Verifique em: https://techverseapp.vercel.app/promocoes')

    } catch (error) {
        console.error('❌ Erro ao adicionar promoção:', error)
        console.error('')
        console.error('💡 Dicas:')
        console.error('   - Verifique se o arquivo .env está configurado')
        console.error('   - Confirme que as credenciais do Firebase estão corretas')
        console.error('   - Verifique se você tem permissão para escrever no Firestore')
    }

    process.exit(0)
}

// Executar
addPromo()
