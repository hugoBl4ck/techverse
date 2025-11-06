<script setup>
import { ref, watch } from 'vue';
import { db } from '@/firebase/config.js';
import { collection, addDoc, doc, getDoc, updateDoc } from 'firebase/firestore';
import { useRouter } from 'vue-router';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const props = defineProps({
  id: { type: String, default: null },
});

const router = useRouter();

const nome = ref('');
const quantidade = ref(0);
const precoCusto = ref(0);
const precoVenda = ref(0);
const tipo = ref('');
const socket = ref('');
const tipoRam = ref('');
const isLoading = ref(false);

const tiposPeca = [
  { value: 'cpu', label: 'CPU' },
  { value: 'placa-mae', label: 'Placa-Mãe' },
  { value: 'ram', label: 'Memória RAM' },
  { value: 'gpu', label: 'GPU' },
  { value: 'armazenamento', label: 'Armazenamento' },
  { value: 'fonte', label: 'Fonte' },
  { value: 'gabinete', label: 'Gabinete' },
];

async function fetchPeca(id) {
  if (!id) return;
  const docRef = doc(db, 'pecas', id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    const data = docSnap.data();
    nome.value = data.nome;
    quantidade.value = data.quantidade;
    precoCusto.value = data.precoCusto;
    precoVenda.value = data.precoVenda;
    tipo.value = data.tipo;
    socket.value = data.compatibilidade?.socket || '';
    tipoRam.value = data.compatibilidade?.tipoRam || '';
  } else {
    console.error('No such document!');
    router.push('/inventario'); // Redirect if not found
  }
}

watch(() => props.id, (newId) => {
  fetchPeca(newId);
}, { immediate: true });

async function handleSubmit() {
  if (!nome.value || !tipo.value) {
    console.error('Nome e Tipo da peça são obrigatórios.');
    return;
  }

  isLoading.value = true;
  try {
    const pecaData = {
      nome: nome.value,
      quantidade: quantidade.value,
      precoCusto: precoCusto.value,
      precoVenda: precoVenda.value,
      tipo: tipo.value,
      compatibilidade: {
        socket: socket.value,
        tipoRam: tipoRam.value,
      },
    };

    if (props.id) {
      // Update existing document
      const docRef = doc(db, 'pecas', props.id);
      await updateDoc(docRef, pecaData);
      console.log('Peça atualizada!');
    } else {
      // Add new document
      await addDoc(collection(db, 'pecas'), pecaData);
      console.log('Peça salva!');
    }
    router.push('/inventario'); // Redirect to list after save/update
  } catch (error) {
    console.error('Erro ao salvar peça: ', error);
  } finally {
    isLoading.value = false;
  }
}