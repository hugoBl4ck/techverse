import { ref, computed, onMounted } from 'vue'

const FONT_SIZE_KEY = 'app-font-size-level'
const MAX_FONT_SIZE_LEVEL = 2 // 0: small, 1: medium, 2: large

const fontSizeLevel = ref(0) // Default to medium

export function useFontSize() {
  onMounted(() => {
    const storedLevel = localStorage.getItem(FONT_SIZE_KEY)
    if (storedLevel !== null) {
      fontSizeLevel.value = parseInt(storedLevel)
    }
    applyFontSizeClass()
  })

  const fontSizeClass = computed(() => {
    switch (fontSizeLevel.value) {
      case 0:
        return 'font-size-small'
      case 1:
        return 'font-size-medium'
      case 2:
        return 'font-size-large'
      default:
        return 'font-size-medium'
    }
  })

  const applyFontSizeClass = () => {
    document.body.classList.remove('font-size-small', 'font-size-medium', 'font-size-large')
    document.body.classList.add(fontSizeClass.value)
  }

  const increaseFontSize = () => {
    if (fontSizeLevel.value < MAX_FONT_SIZE_LEVEL) {
      fontSizeLevel.value++
      localStorage.setItem(FONT_SIZE_KEY, fontSizeLevel.value.toString())
      applyFontSizeClass()
    }
  }

  const decreaseFontSize = () => {
    if (fontSizeLevel.value > 0) {
      fontSizeLevel.value--
      localStorage.setItem(FONT_SIZE_KEY, fontSizeLevel.value.toString())
      applyFontSizeClass()
    }
  }

  return {
    fontSizeLevel,
    fontSizeClass,
    increaseFontSize,
    decreaseFontSize
  }
}
