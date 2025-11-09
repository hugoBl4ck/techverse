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
      error.value = 'Nome e Tipo são obrigatórios.';
      return;
    }

    isLoading.value = true;
    error.value = null;

    try {
      const itemCol = collection(db, 'itens');
      if (itemId) {
        const docRef = doc(itemCol, itemId);
        await updateDoc(docRef, { ...form });
      } else {
        await addDoc(itemCol, { ...form, createdAt: new Date() });
      }
    } catch (e) {
      error.value = 'Erro ao salvar o item.';
      console.error(e);
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * Handles the upload of a file to Vercel Storage.
   * This is a placeholder function. For a real implementation, you would need a serverless function
   * to handle the upload securely.
   *
   * @param {File} file The file to upload.
   * @returns {Promise<string|null>} The URL of the uploaded file or null on error.
   */
  async function uploadImage(file) {
    if (!file) return null;

    isLoading.value = true;
    error.value = null;

    try {
      // =================================================================
      // INÍCIO DA IMPLEMENTAÇÃO REAL (exemplo)
      // =================================================================
      /*
      // 1. Chamar uma função serverless para obter uma URL de upload segura
      const response = await fetch('/api/upload-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename: file.name, contentType: file.type }),
      });
      const { url, downloadUrl } = await response.json();

      // 2. Fazer o upload do arquivo para a URL retornada
      await fetch(url, {
        method: 'PUT',
        body: file,
        headers: { 'Content-Type': file.type },
      });

      // 3. Retornar a URL de download
      return downloadUrl;
      */
      // =================================================================
      // FIM DA IMPLEMENTAÇÃO REAL
      // =================================================================

      // Simulação de upload para fins de desenvolvimento
      console.log(`[SIMULAÇÃO] Upload do arquivo: ${file.name}`);
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simula o tempo de upload
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
