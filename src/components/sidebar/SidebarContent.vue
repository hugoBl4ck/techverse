<template>
  <div class="sidebar-content">
    <slot></slot>
    <div class="font-size-controls flex justify-center gap-2 p-4 border-t border-gray-200 dark:border-gray-700">
      <button @click="decreaseFontSize" class="btn-social text-lg font-bold">A-</button>
      <button @click="increaseFontSize" class="btn-social text-lg font-bold">A+</button>
    </div>
    <div class="social-links flex justify-center gap-2 p-4 border-t border-gray-200 dark:border-gray-700">
      <a href="https://wa.me/5577998267548" target="_blank" rel="noopener noreferrer" class="btn-social" data-tooltip="WhatsApp">
        <img :src="whatsappIcon" alt="WhatsApp" class="w-6 h-6" />
      </a>
      <a href="mailto:hugovieira.eng@gmail.com" target="_blank" rel="noopener noreferrer" class="btn-social" data-tooltip="Gmail">
        <img :src="gmailIcon" alt="Gmail" class="w-6 h-6" />
      </a>
      <a href="https://discord.com/" target="_blank" rel="noopener noreferrer" class="btn-social" data-tooltip="Discord">
        <img :src="discordIcon" alt="Discord" class="w-6 h-6" />
      </a>
      <a href="https://t.me/" target="_blank" rel="noopener noreferrer" class="btn-social" data-tooltip="Telegram">
        <img :src="telegramIcon" alt="Telegram" class="w-6 h-6" />
      </a>
    </div>
  </div>
</template>

<script setup>
import whatsappIcon from '@/assets/images/whatsapp.png'
import gmailIcon from '@/assets/images/gmail.png'
import discordIcon from '@/assets/images/discord.png'
import telegramIcon from '@/assets/images/telegram.png'
import { useFontSize } from '@/composables/useFontSize'

const { increaseFontSize, decreaseFontSize } = useFontSize()
</script>

<style scoped>
.sidebar-content {
  flex-grow: 1;
  overflow-y: auto;
}
.social-links {
  /* Add any specific styling for the social links container if needed */
}
.font-size-controls {
  /* Add any specific styling for the font size controls container if needed */
}
</style>
