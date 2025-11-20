<script setup>
import { ref } from 'vue';
import { Plus, Minus } from 'lucide-vue-next';

const faqs = [
  {
    question: "O TechVerse é realmente gratuito?",
    answer: "Sim! O TechVerse é 100% gratuito para técnicos. Nossa monetização vem de parcerias e links de afiliados em promoções de hardware, sem custo extra para você."
  },
  {
    question: "Meus dados e dos meus clientes estão seguros?",
    answer: "Absolutamente. Utilizamos a infraestrutura do Google Firebase, uma das mais seguras do mundo. Seus dados são isolados e apenas você tem acesso às informações da sua loja."
  },
  {
    question: "Preciso instalar algo no meu computador?",
    answer: "Não obrigatóriamente. O TechVerse é um Web App (PWA) que roda direto no navegador. Você pode instalá-lo como um aplicativo se desejar, para acesso offline e mais rápido."
  },
  {
    question: "Como funciona a importação com IA?",
    answer: "Nossa IA analisa o texto de anúncios (Facebook, WhatsApp, OLX) e identifica automaticamente as peças (CPU, GPU, RAM, etc.), preenchendo o formulário de cadastro para você em segundos."
  }
];

const openIndex = ref(null);

const toggle = (index) => {
  openIndex.value = openIndex.value === index ? null : index;
};
</script>

<template>
  <section class="py-24 px-4 sm:px-6 lg:px-8 bg-background relative overflow-hidden">
    <div class="max-w-3xl mx-auto">
      <div class="text-center mb-16">
        <h2 class="font-display text-4xl font-bold text-foreground mb-4">Perguntas Frequentes</h2>
        <p class="text-muted-foreground">Tudo o que você precisa saber para começar.</p>
      </div>

      <div class="space-y-4">
        <div 
          v-for="(faq, index) in faqs" 
          :key="index"
          class="border border-border/50 rounded-lg bg-card/50 backdrop-blur-sm overflow-hidden transition-all duration-200 hover:border-primary/30"
        >
          <button 
            @click="toggle(index)"
            class="w-full flex items-center justify-between p-6 text-left focus:outline-none"
          >
            <span class="font-semibold text-foreground">{{ faq.question }}</span>
            <component 
              :is="openIndex === index ? Minus : Plus" 
              class="w-5 h-5 text-primary transition-transform duration-200"
            />
          </button>
          <div 
            v-show="openIndex === index"
            class="px-6 pb-6 text-muted-foreground leading-relaxed animate-in slide-in-from-top-2 fade-in duration-200"
          >
            {{ faq.answer }}
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
