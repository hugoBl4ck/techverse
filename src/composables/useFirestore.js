import { ref } from 'vue'
import { db } from '@/firebase/config.js'
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  orderBy,
  where,
  Timestamp,
  writeBatch
} from 'firebase/firestore'

/**
 * Composable para gerenciar Promoções, Notícias e Configurações PIX no Firestore
 */
export function useFirestore() {
  const isLoading = ref(false)
  const error = ref(null)

  /**
   * Carrega todas as promoções
   */
  const getPromos = async () => {
    try {
      isLoading.value = true
      const promosRef = collection(db, 'promos')
      const snapshot = await getDocs(promosRef)

      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        dataInicio: doc.data().dataInicio?.toDate?.() || doc.data().dataInicio,
        dataFim: doc.data().dataFim?.toDate?.() || doc.data().dataFim,
        criadoEm: doc.data().criadoEm?.toDate?.() || doc.data().criadoEm
      }))
    } catch (err) {
      console.error('Erro ao carregar promoções:', err)
      error.value = err
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Salva uma promoção (criar ou atualizar)
   */
  const savePromo = async (promo) => {
    try {
      isLoading.value = true

      // Filtrar fotos vazias
      const fotosFiltradas = (promo.fotos || []).filter(f => f && f.trim())

      const promoData = {
        titulo: promo.titulo,
        descricao: promo.descricao || '',
        desconto: promo.desconto || 0,
        dataInicio: promo.dataInicio ? new Date(promo.dataInicio) : null,
        dataFim: promo.dataFim ? new Date(promo.dataFim) : null,
        linkCompra: promo.linkCompra || '',
        fotos: fotosFiltradas,
        ativo: promo.ativo !== false,
        atualizadoEm: new Date()
      }

      if (promo.id) {
        // Atualizar
        const promoRef = doc(db, 'promos', promo.id)
        await updateDoc(promoRef, promoData)
        return promo.id
      } else {
        // Criar
        promoData.criadoEm = new Date()
        const docRef = await addDoc(collection(db, 'promos'), promoData)
        return docRef.id
      }
    } catch (err) {
      console.error('Erro ao salvar promoção:', err)
      error.value = err
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Deleta uma promoção
   */
  const deletePromo = async (id) => {
    try {
      isLoading.value = true
      const promoRef = doc(db, 'promos', id)
      await deleteDoc(promoRef)
    } catch (err) {
      console.error('Erro ao deletar promoção:', err)
      error.value = err
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Carrega todas as notícias
   */
  const getNews = async () => {
    try {
      isLoading.value = true
      const newsRef = collection(db, 'noticias')
      const q = query(newsRef, orderBy('dataPub', 'desc'))
      const snapshot = await getDocs(q)

      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        dataPub: doc.data().dataPub?.toDate?.() || doc.data().dataPub,
        criadoEm: doc.data().criadoEm?.toDate?.() || doc.data().criadoEm
      }))
    } catch (err) {
      console.error('Erro ao carregar notícias:', err)
      error.value = err
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Salva uma notícia (criar ou atualizar)
   */
  const saveNews = async (news) => {
    try {
      isLoading.value = true

      const newsData = {
        titulo: news.titulo,
        conteudo: news.conteudo || '',
        dataPub: news.dataPub ? new Date(news.dataPub) : new Date(),
        categoria: news.categoria || 'tech',
        imagem: news.imagem || '',
        views: news.views || 0,
        ativo: news.ativo !== false,
        atualizadoEm: new Date()
      }

      if (news.id) {
        // Atualizar
        const newsRef = doc(db, 'noticias', news.id)
        await updateDoc(newsRef, newsData)
        return news.id
      } else {
        // Criar
        newsData.criadoEm = new Date()
        const docRef = await addDoc(collection(db, 'noticias'), newsData)
        return docRef.id
      }
    } catch (err) {
      console.error('Erro ao salvar notícia:', err)
      error.value = err
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Deleta uma notícia
   */
  const deleteNews = async (id) => {
    try {
      isLoading.value = true
      const newsRef = doc(db, 'noticias', id)
      await deleteDoc(newsRef)
    } catch (err) {
      console.error('Erro ao deletar notícia:', err)
      error.value = err
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Carrega configuração PIX
   */
  const getPixConfig = async () => {
    try {
      isLoading.value = true
      const configRef = collection(db, 'config')
      const q = query(configRef, where('tipo', '==', 'pix'))
      const snapshot = await getDocs(q)

      if (snapshot.docs.length > 0) {
        return snapshot.docs[0].data()
      }
      return null
    } catch (err) {
      console.error('Erro ao carregar config PIX:', err)
      error.value = err
      return null
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Salva configuração PIX
   */
  const savePixConfig = async (config) => {
    try {
      isLoading.value = true

      const pixData = {
        tipo: 'pix',
        chave: config.chave,
        nomeRecebimento: config.nomeRecebimento || '',
        cidade: config.cidade || '',
        cep: config.cep || '',
        atualizadoEm: new Date()
      }

      // Procura por config PIX existente
      const configRef = collection(db, 'config')
      const q = query(configRef, where('tipo', '==', 'pix'))
      const snapshot = await getDocs(q)

      if (snapshot.docs.length > 0) {
        // Atualizar
        const docRef = doc(db, 'config', snapshot.docs[0].id)
        await updateDoc(docRef, pixData)
        return snapshot.docs[0].id
      } else {
        // Criar
        pixData.criadoEm = new Date()
        const docRef = await addDoc(collection(db, 'config'), pixData)
        return docRef.id
      }
    } catch (err) {
      console.error('Erro ao salvar config PIX:', err)
      error.value = err
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Registra uma doação (para analytics)
   */
  const recordDonation = async (donation) => {
    try {
      isLoading.value = true

      const donationData = {
        valor: donation.valor || 0,
        chaveOrigem: donation.chaveOrigem || 'desconhecida',
        anonimo: donation.anonimo !== false,
        transactionId: donation.transactionId || null,
        criadoEm: new Date(),
        status: 'pendente' // pendente, confirmada, rejeitada
      }

      const docRef = await addDoc(collection(db, 'doacoes'), donationData)
      return docRef.id
    } catch (err) {
      console.error('Erro ao registrar doação:', err)
      error.value = err
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Carrega doações confirmadas
   */
  const getDonations = async (limit = 10) => {
    try {
      isLoading.value = true
      const doacoesRef = collection(db, 'doacoes')
      const q = query(
        doacoesRef,
        where('status', '==', 'confirmada'),
        orderBy('criadoEm', 'desc')
      )
      const snapshot = await getDocs(q)

      return snapshot.docs.slice(0, limit).map(doc => ({
        id: doc.id,
        ...doc.data(),
        criadoEm: doc.data().criadoEm?.toDate?.() || doc.data().criadoEm
      }))
    } catch (err) {
      console.error('Erro ao carregar doações:', err)
      error.value = err
      return []
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Carrega estatísticas de doações
   */
  const getDonationStats = async () => {
    try {
      isLoading.value = true
      const doacoesRef = collection(db, 'doacoes')
      const q = query(doacoesRef, where('status', '==', 'confirmada'))
      const snapshot = await getDocs(q)

      const total = snapshot.docs.length
      const amount = snapshot.docs.reduce((acc, doc) => acc + (doc.data().valor || 0), 0)

      return {
        total,
        amount: amount.toFixed(2)
      }
    } catch (err) {
      console.error('Erro ao carregar stats:', err)
      error.value = err
      return { total: 0, amount: '0.00' }
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Carrega promoções ativas para exibir em public views
   */
  const getActivePromos = async () => {
    try {
      const promosRef = collection(db, 'promos')
      const q = query(promosRef, where('ativo', '==', true))
      const snapshot = await getDocs(q)

      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        dataInicio: doc.data().dataInicio?.toDate?.() || doc.data().dataInicio,
        dataFim: doc.data().dataFim?.toDate?.() || doc.data().dataFim
      }))
    } catch (err) {
      console.error('Erro ao carregar promoções ativas:', err)
      return []
    }
  }

  /**
   * Carrega notícias publicadas para exibir em public views
   */
  const getPublishedNews = async () => {
    try {
      const newsRef = collection(db, 'noticias')
      const q = query(
        newsRef,
        where('ativo', '==', true),
        orderBy('dataPub', 'desc')
      )
      const snapshot = await getDocs(q)

      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        dataPub: doc.data().dataPub?.toDate?.() || doc.data().dataPub
      }))
    } catch (err) {
      console.error('Erro ao carregar notícias publicadas:', err)
      return []
    }
  }

  return {
    isLoading,
    error,
    getPromos,
    savePromo,
    deletePromo,
    getNews,
    saveNews,
    deleteNews,
    getPixConfig,
    savePixConfig,
    recordDonation,
    getDonations,
    getDonationStats,
    getActivePromos,
    getPublishedNews
  }
}
