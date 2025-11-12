# TechVerse Logo - Opções de Ícone Tech

## 📍 Localização
O componente está em: `src/components/TechVerseLogo.vue`

Já está implementado em:
- Header (barra superior da landing page)
- Footer (rodapé da landing page)

## 🎯 Opções Disponíveis

### 1. **Microchip** (RECOMENDADO - DEFAULT)
```javascript
const iconType = 'microchip'
```
- Microchip futurista com pinos
- Tem um grid interno que representa circuitos
- Pinos pulsantes nas 4 direções (efeito animado)
- Centro brilhante que reage ao hover
- Combina bem com "tech" puro

**Vibe:** Profissional, moderno, tech-forward ✨

---

### 2. **CPU Circuit**
```javascript
const iconType = 'cpu-circuit'
```
- CPU central com linhas de circuito
- 4 pontos de conexão pulsantes (animação defasada)
- Linhas conectando os pontos ao centro
- Mais tradicional/clássico

**Vibe:** Processador, computação, tecnologia pura 🖥️

---

### 3. **Flame Circuit**
```javascript
const iconType = 'flame-circuit'
```
- Chama estilizada pulsante no topo
- Circuito/base na parte inferior
- Combina energia com tecnologia

**Vibe:** Energético, poderoso, com alma 🔥

---

### 4. **Lightning Tech**
```javascript
const iconType = 'lightning-tech'
```
- Lightning bolt (raio) com efeito glow
- Linha de circuito diagonal tracejada (animada)
- Ultra moderno e dinâmico

**Vibe:** Rápido, energético, futurista ⚡

---

## 🔧 Como Trocar

Edite o arquivo `src/components/TechVerseLogo.vue` na linha 9:

```javascript
// Linha 9
const iconType = 'microchip' // mude para uma das opções acima
```

## ✨ Efeitos Animados

Todos os ícones têm:
- ✅ **Hover glow** - Brilho animado ao passar o mouse
- ✅ **Pulsação** - Alguns elementos pulsam continuamente
- ✅ **Animações CSS** - Smooth e performáticas
- ✅ **Cores gradiente** - Primary → Accent

## 📱 Responsividade

O logo mantém tamanho: **w-8 h-8** (32px × 32px)
- Funciona bem em header e footer
- Se quiser ajustar, edite a classe `.w-8 h-8`

---

## 🎨 Customização Futura

Se quiser editar cores, animações, etc:
1. As cores vêm das variáveis CSS:
   - `from-primary` (cor primária do seu tema)
   - `to-accent` (cor de acento)
   
2. As animações estão em `<style scoped>` no final do arquivo

3. SVG está inline, então é fácil modificar formas/caminhos

---

## ✅ Status Atual

- ✔️ Componente criado
- ✔️ Importado em `LandingView.vue`
- ✔️ Implementado no header
- ✔️ Implementado no footer
- ✔️ Build sem erros
- ✔️ Pronto para produção

**Qual você prefere usar?** 🚀
