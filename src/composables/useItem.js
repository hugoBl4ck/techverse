
import { ref, reactive, watch } from 'vue';
import { db } from '@/firebase/config.js';
import { collection, addDoc, doc, getDoc, updateDoc } from 'firebase/firestore';
import { useRouter } from 'vue-router';

export function useItem(itemId = null) {
  const router = useRouter();
  const form = reactive({
    nome: '',
    quantidade: 0,
    precoCusto: 0,
    precoVenda: 0,
    tipo: '',
    compatibilidade: {
      socket: '',
      tipoRam: '',
    },
    imageUrl: '',
    descricao: '',
  });
  const isLoading = ref(false);
  const error = ref(null);

  async function fetchItem() {
    if (!itemId) return;
    isLoading.value = true;
    try {
      const docRef = doc(db, 'itens', itemId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        form.nome = data.nome;
        form.quantidade = data.quantidade;
        form.precoCusto = data.precoCusto;
        form.precoVenda = data.precoVenda;
        form.tipo = data.tipo;
        form.compatibilidade = data.compatibilidade || { socket: '', tipoRam: '' };
        form.imageUrl = data.imageUrl || '';
        form.descricao = data.descricao || '';
      } else {
        error.value = 'Item não encontrado.';
        router.push('/inventario');
      }
    } catch (e) {
      error.value = 'Erro ao buscar o item.';
      console.error(e);
    } finally {
      isLoading.value = false;
    }
  }

  async function saveItem() {
    if (!form.nome || !form.tipo) {
      error.value = 'Nome e Tipo do item são obrigatórios.';
      return;
    }

    isLoading.value = true;
    error.value = null;

    try {
      if (itemId) {
        const docRef = doc(db, 'itens', itemId);
        await updateDoc(docRef, { ...form });
      } else {
        await addDoc(collection(db, 'itens'), { ...form, createdAt: new Date() });
      }
    } catch (e) {
      error.value = 'Erro ao salvar o item.';
      console.error(e);
    } finally {
      isLoading.value = false;
    }
  }

  watch(() => itemId, (newId) => {
    if (newId) {
      fetchItem();
    }
  }, { immediate: true });

  return {
    form,
    isLoading,
    error,
    saveItem,
  };
}
