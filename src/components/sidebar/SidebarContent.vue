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
  padding: 0.5rem 0;
}

.sidebar-content::-webkit-scrollbar {
  width: 6px;
}

.sidebar-content::-webkit-scrollbar-track {
  background: transparent;
}

.sidebar-content::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, var(--color-primary), var(--color-accent));
  border-radius: 3px;
  opacity: 0.5;
}

.sidebar-content::-webkit-scrollbar-thumb:hover {
  opacity: 0.8;
}

.social-links {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem;
  border-top: 1px solid rgba(var(--color-border), 0.2);
  background: linear-gradient(135deg, rgba(var(--color-primary), 0.05) 0%, rgba(var(--color-accent), 0.05) 100%);
  border-radius: 0.5rem;
  margin: 0.5rem;
}

.font-size-controls {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem;
  border-top: 1px solid rgba(var(--color-border), 0.2);
  background: linear-gradient(135deg, rgba(var(--color-primary), 0.05) 0%, rgba(var(--color-accent), 0.05) 100%);
  border-radius: 0.5rem;
  margin: 0.5rem;
}

.btn-social {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: linear-gradient(135deg, rgba(var(--color-primary), 0.1), rgba(var(--color-accent), 0.05));
  color: var(--color-primary);
  border: 1px solid rgba(var(--color-primary), 0.2);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  cursor: pointer;
}

.btn-social::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(var(--color-primary), 0.2), transparent);
  transition: left 0.5s ease;
}

.btn-social:hover {
  background: linear-gradient(135deg, rgba(var(--color-primary), 0.2), rgba(var(--color-accent), 0.1));
  border-color: rgba(var(--color-primary), 0.5);
  box-shadow: 0 4px 12px rgba(var(--color-primary), 0.15);
  transform: translateY(-2px);
}

.btn-social:hover::before {
  left: 100%;
}
</style>
