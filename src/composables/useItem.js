import { ref, reactive } from 'vue';
import { db } from '@/firebase/config.js';
import { collection, addDoc, doc, getDoc, updateDoc } from 'firebase/firestore';
import { useRouter } from 'vue-router';
import { useCurrentStore } from './useCurrentStore';

export function useItem(itemId = null) {
  const router = useRouter();
  const { storeId } = useCurrentStore();

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
    if (!itemId || !storeId.value) return;
    isLoading.value = true;
    try {
      const docRef = doc(db, 'stores', storeId.value, 'items', itemId);
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
        alert('Item não encontrado!');
        router.push('/inventario');
      }
    } catch (e) {
      error.value = 'Erro ao buscar o item.';
      console.error(e);
      alert('Erro ao buscar item: ' + e.message);
    } finally {
      isLoading.value = false;
    }
  }

  async function saveItem() {
    if (!form.nome || !form.tipo) {
      error.value = 'Nome e Tipo são obrigatórios.';
      alert('Nome e Tipo são obrigatórios.');
      return;
    }

    if (!storeId.value) {
      error.value = 'Usuário não autenticado.';
      alert('Erro: Usuário não autenticado.');
      return;
    }

    isLoading.value = true;
    error.value = null;

    try {
      const itemCol = collection(db, 'stores', storeId.value, 'items');
      if (itemId) {
        const docRef = doc(itemCol, itemId);
        await updateDoc(docRef, { ...form });
        alert('Item atualizado com sucesso!');
      } else {
        await addDoc(itemCol, { ...form, createdAt: new Date() });
        alert('Item cadastrado com sucesso!');
      }
    } catch (e) {
      error.value = 'Erro ao salvar o item.';
      console.error(e);
      alert('Erro ao salvar item: ' + e.message);
    } finally {
      isLoading.value = false;
    }
  }

  async function uploadImage(file) {
    if (!file) return null;

    isLoading.value = true;
    error.value = null;

    try {
      // Simulação de upload para fins de desenvolvimento
      console.log(`[SIMULAÇÃO] Upload do arquivo: ${file.name}`);
      await new Promise(resolve => setTimeout(resolve, 1500));
      const fakeUrl = `https://fake-storage.vercel.app/${Date.now()}-${file.name}`;
      console.log(`[SIMULAÇÃO] Arquivo disponível em: ${fakeUrl}`);
      return fakeUrl;

    } catch (e) {
      error.value = 'Erro ao fazer upload da imagem.';
      console.error(e);
      return null;
    } finally {
      isLoading.value = false;
    }
  }

  return {
    form,
    isLoading,
    error,
    saveItem,
    uploadImage,
  };
}
