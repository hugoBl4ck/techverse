<template>
  <Card class="fade-in border-l-4 border-l-amber-500 overflow-hidden">
    <CardHeader
      class="pb-3 bg-gradient-to-r from-amber-50/50 to-transparent dark:from-amber-950/20"
    >
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <Wand2 class="h-5 w-5 text-amber-600 dark:text-amber-400" />
          <CardTitle>🤖 Gerador de Promoções com IA</CardTitle>
        </div>
        <Badge variant="secondary" class="text-xs">Perplexity AI</Badge>
      </div>
      <CardDescription
        >Cole um link ou nome do produto e gere uma promoção completa
        automaticamente</CardDescription
      >
    </CardHeader>

    <CardContent class="space-y-4">
      <!-- Input Section -->
      <div
        class="space-y-3 p-4 border rounded-lg bg-slate-50 dark:bg-slate-900/30"
      >
        <div class="space-y-1">
          <label class="text-sm font-medium"
            >Link do Produto (AliExpress, etc)</label
          >
          <Input
            v-model="generatorForm.productLink"
            placeholder="https://s.click.aliexpress.com/e/_c3bJkjYV"
            type="url"
            class="text-sm"
          />
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div class="space-y-1">
            <label class="text-sm font-medium">Nome do Produto</label>
            <Input
              v-model="generatorForm.productName"
              placeholder="Soyo Motherboard AMD B550M"
              class="text-sm"
            />
          </div>
          <div class="space-y-1">
            <label class="text-sm font-medium">Preço Atual (BRL)</label>
            <Input
              v-model.number="generatorForm.productPrice"
              placeholder="425.99"
              type="number"
              step="0.01"
              class="text-sm"
            />
          </div>
        </div>

        <div class="space-y-1">
          <label class="text-sm font-medium">Preço Original (BRL)</label>
          <Input
            v-model.number="generatorForm.originalPrice"
            placeholder="851.98"
            type="number"
            step="0.01"
            class="text-sm"
          />
        </div>

        <Button
          @click="gerarPromoComIA"
          :disabled="
            generatingPromo ||
            (!generatorForm.productLink && !generatorForm.productName)
          "
          class="w-full"
        >
          <Wand2 class="mr-2 h-4 w-4" />
          {{
            generatingPromo ? "Gerando promoção..." : "Gerar Promoção com IA"
          }}
        </Button>
      </div>

      <!-- Generated Promo Preview -->
      <div
        v-if="generatedPromo"
        class="space-y-3 p-4 border rounded-lg bg-green-50/30 dark:bg-green-950/20 border-green-200 dark:border-green-800"
      >
        <h4 class="font-semibold text-sm flex items-center gap-2">
          <CheckCircle2 class="h-4 w-4 text-green-600" />
          Promoção Gerada com Sucesso!
        </h4>

        <div class="space-y-2 text-sm">
          <div>
            <label class="font-medium block mb-1">Título</label>
            <Input v-model="generatedPromo.titulo" class="text-sm" />
          </div>

          <div>
            <label class="font-medium block mb-1">Descrição</label>
            <textarea
              v-model="generatedPromo.descricao"
              class="w-full p-2 text-sm border rounded-md resize-none h-16"
            />
          </div>

          <div class="grid grid-cols-2 gap-2">
            <div>
              <label class="font-medium block mb-1">Desconto (%)</label>
              <Input
                v-model.number="generatedPromo.desconto"
                type="number"
                class="text-sm"
              />
            </div>
            <div>
              <label class="font-medium block mb-1">Link de Compra</label>
              <Input
                v-model="generatedPromo.linkCompra"
                type="url"
                class="text-sm"
              />
            </div>
          </div>

          <!-- Generated Images -->
          <div v-if="generatedPromo.fotos && generatedPromo.fotos.length > 0">
            <label class="font-medium block mb-2">Imagens Encontradas</label>
            <div class="flex gap-2 flex-wrap">
              <div
                v-for="(foto, idx) in generatedPromo.fotos"
                :key="idx"
                class="relative"
              >
                <img
                  :src="foto"
                  :alt="`Foto ${idx + 1}`"
                  class="h-20 w-20 rounded border object-cover"
                />
                <button
                  @click="generatedPromo.fotos.splice(idx, 1)"
                  class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>

          <!-- Add More Images -->
          <div>
            <label class="font-medium block mb-1"
              >Adicionar Mais Imagens (URLs)</label
            >
            <div class="space-y-2">
              <div
                v-for="(foto, idx) in generatedPromo.fotos || []"
                :key="`extra-${idx}`"
                class="flex gap-2"
              >
                <Input
                  v-model="generatedPromo.fotos[idx]"
                  placeholder="https://..."
                  type="url"
                  class="text-xs"
                />
                <Button
                  @click="generatedPromo.fotos.splice(idx, 1)"
                  variant="ghost"
                  size="sm"
                  class="h-9"
                >
                  ✕
                </Button>
              </div>
              <Button
                @click="
                  generatedPromo.fotos = [...(generatedPromo.fotos || []), '']
                "
                variant="outline"
                size="sm"
                class="w-full"
              >
                + Adicionar Foto
              </Button>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex gap-2 pt-2">
          <Button
            @click="adicionarAoPanel"
            class="flex-1 bg-green-600 hover:bg-green-700"
            :disabled="addingPromo"
          >
            <Plus class="mr-2 h-4 w-4" />
            {{ addingPromo ? "Adicionando..." : "Adicionar ao Painel" }}
          </Button>
          <Button @click="gerarNovaPromo" variant="outline" class="flex-1">
            Nova Promoção
          </Button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="generatingPromo" class="space-y-2">
        <Skeleton height="2rem" />
        <Skeleton height="6rem" />
        <Skeleton height="2rem" />
      </div>
    </CardContent>
  </Card>
</template>

<script setup>
import { ref } from "vue";
import { toast } from "vue-sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Wand2, CheckCircle2, Plus } from "lucide-vue-next";
import { useFirestore } from "@/composables/useFirestore";

const { savePromo } = useFirestore();

const generatorForm = ref({
  productLink: "",
  productName: "",
  productPrice: null,
  originalPrice: null,
});

const generatedPromo = ref(null);
const generatingPromo = ref(false);
const addingPromo = ref(false);

const emit = defineEmits(["promo-added"]);

async function gerarPromoComIA() {
  if (!generatorForm.value.productLink && !generatorForm.value.productName) {
    toast.error("Forneça pelo menos um link ou nome do produto");
    return;
  }

  generatingPromo.value = true;
  try {
    const response = await fetch("/api/generate-promo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productLink: generatorForm.value.productLink,
        productName: generatorForm.value.productName,
        productPrice: generatorForm.value.productPrice,
        originalPrice: generatorForm.value.originalPrice,
      }),
    });

    if (!response.ok) {
      throw new Error("Erro ao gerar promoção");
    }

    const data = await response.json();
    generatedPromo.value = {
      ...data.promocao,
      dataInicio: new Date().toISOString().split("T")[0],
      dataFim: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      ativo: true,
    };

    toast.success("Promoção gerada com sucesso!");
  } catch (error) {
    console.error("Erro:", error);
    toast.error("Erro ao gerar promoção com IA");
  } finally {
    generatingPromo.value = false;
  }
}

async function adicionarAoPanel() {
  if (!generatedPromo.value.titulo) {
    toast.error("Preencha o título");
    return;
  }

  addingPromo.value = true;
  try {
    await savePromo({
      titulo: generatedPromo.value.titulo,
      descricao: generatedPromo.value.descricao,
      desconto: generatedPromo.value.desconto,
      dataInicio: generatedPromo.value.dataInicio,
      dataFim: generatedPromo.value.dataFim,
      linkCompra: generatedPromo.value.linkCompra,
      fotos: (generatedPromo.value.fotos || []).filter((f) => f && f.trim()),
      ativo: generatedPromo.value.ativo,
    });

    toast.success("Promoção adicionada ao painel!");
    emit("promo-added");
    gerarNovaPromo();
  } catch (error) {
    console.error("Erro:", error);
    toast.error("Erro ao adicionar promoção");
  } finally {
    addingPromo.value = false;
  }
}

function gerarNovaPromo() {
  generatorForm.value = {
    productLink: "",
    productName: "",
    productPrice: null,
    originalPrice: null,
  };
  generatedPromo.value = null;
}
</script>
