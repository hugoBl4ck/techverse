<script setup>
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { User } from 'lucide-vue-next';
import { computed } from 'vue';

const props = defineProps({
  message: {
    type: Object,
    required: true
  },
  isAuthor: {
    type: Boolean,
    default: false
  }
});

const formattedDate = computed(() => {
  if (!props.message.createdAt) return 'Data desconhecida';
  // Handle Firestore Timestamp
  const date = props.message.createdAt.toDate ? props.message.createdAt.toDate() : new Date(props.message.createdAt);
  return formatDistanceToNow(date, { addSuffix: true, locale: ptBR });
});

const memberSince = computed(() => {
  if (!props.message.authorMemberSince) return null;
  const date = props.message.authorMemberSince.toDate ? props.message.authorMemberSince.toDate() : new Date(props.message.authorMemberSince);
  return date.toLocaleDateString('pt-BR');
});
</script>

<template>
  <div class="flex gap-4 p-4 border-b border-border/40 hover:bg-muted/20 transition-colors">
    <!-- Author Info Column -->
    <div class="flex flex-col items-center w-24 sm:w-32 shrink-0 space-y-2">
      <div class="h-12 w-12 sm:h-16 sm:w-16 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden border border-border">
        <img 
          v-if="message.authorAvatar" 
          :src="message.authorAvatar" 
          :alt="message.authorName" 
          class="h-full w-full object-cover"
        />
        <User v-else class="h-6 w-6 sm:h-8 sm:w-8 text-primary/60" />
      </div>
      
      <div class="text-center">
        <p class="font-semibold text-sm truncate w-full" :title="message.authorName">
          {{ message.authorName || 'Anônimo' }}
        </p>
        <span v-if="isAuthor" class="inline-block px-2 py-0.5 text-[10px] bg-primary/10 text-primary rounded-full mt-1">
          Autor
        </span>
      </div>

      <div v-if="memberSince" class="text-[10px] text-muted-foreground text-center hidden sm:block">
        Membro desde:<br>
        {{ memberSince }}
      </div>
    </div>

    <!-- Message Content Column -->
    <div class="flex-1 min-w-0">
      <div class="flex justify-between items-start mb-2">
        <span class="text-xs text-muted-foreground" :title="message.createdAt?.toDate?.().toLocaleString()">
          {{ formattedDate }}
        </span>
      </div>
      
      <div class="prose prose-sm dark:prose-invert max-w-none break-words whitespace-pre-wrap">
        {{ message.content }}
      </div>
    </div>
  </div>
</template>
