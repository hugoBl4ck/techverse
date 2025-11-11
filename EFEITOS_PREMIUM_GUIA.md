# Guia de Efeitos Premium - TechVerse

## Resumo dos Efeitos Aplicados

Foram integrados efeitos da Landing Page ao `globals.css` de forma sutil para toda a aplicação.

### 1. **Gradientes nos Botões**
- **Classe**: `.btn-gradient-subtle` (completo) ou `.btn-gradient-minimal` (mais sutil)
- **Efeito**: Gradiente de primary para accent
- **Uso**: Botões CTA principais

```html
<button class="btn-gradient-subtle">Clique aqui</button>
```

### 2. **Sombras Coloridas**
- **Efeito**: Sombra com cor da primary (roxo)
- **Aplicado em**: Botões com gradiente, cards premium
- **Hover**: Sombra fica maior e mais visível (0.25 de opacidade)

```css
box-shadow: 0 10px 15px -3px hsl(var(--primary) / 0.25);
```

### 3. **Backdrop Blur (Vidro Fosco)**
- **Classe**: `.navbar-premium`
- **Efeito**: Background semi-transparente com blur de 12px
- **Uso**: Header/Navbar

```html
<header class="navbar-premium">
  <!-- Conteúdo do header -->
</header>
```

### 4. **Sidebar Premium**
- **Classe**: `.sidebar-premium` (container) + `.sidebar-item-premium` (itens)
- **Efeito**: 
  - Background com gradiente sutil
  - Hover com cor primary e inset shadow
  - Border esquerda ao ativar
  
```html
<aside class="sidebar-premium">
  <a href="#" class="sidebar-item-premium sidebar-item-active">
    Dashboard
  </a>
  <a href="#" class="sidebar-item-premium">
    Clientes
  </a>
</aside>
```

### 5. **Efeito Glow nos Botões**
- **Classe**: `.btn-glow`
- **Efeito**: Halo colorido ao passar o mouse
- **Uso**: Botões de ação importante

```html
<button class="btn-glow btn-gradient-subtle">Salvar</button>
```

### 6. **Cards Premium**
- **Classe**: `.card-premium`
- **Efeito**: 
  - Border sutil ao hover
  - Sombra colorida
  - Lift leve (translateY -1px)

```html
<div class="card-premium">
  <!-- Conteúdo do card -->
</div>
```

---

## Como Aplicar na Barra Superior

### AppLayout.vue (Header)

```vue
<header class="navbar-premium">
  <div class="flex items-center justify-between h-16 px-6">
    <!-- Logo -->
    <div class="font-display text-xl font-bold">TechVerse</div>
    
    <!-- Botões de ação -->
    <div class="flex gap-2">
      <button class="btn-gradient-subtle">Exportar</button>
      <button class="btn-glow btn-gradient-minimal">Configurações</button>
    </div>
  </div>
</header>
```

---

## Como Aplicar na Sidebar

### Sidebar Component

```vue
<aside class="sidebar-premium h-screen">
  <nav class="space-y-2 p-4">
    <router-link 
      to="/app" 
      class="sidebar-item-premium sidebar-item-active"
    >
      Dashboard
    </router-link>
    
    <router-link 
      to="/app/clientes" 
      class="sidebar-item-premium"
    >
      Clientes
    </router-link>
    
    <router-link 
      to="/app/inventario" 
      class="sidebar-item-premium"
    >
      Inventário
    </router-link>
  </nav>
</aside>
```

---

## Cores Utilizadas

| Variável | Cor | Uso |
|----------|-----|-----|
| `--primary` | Roxo | Gradientes, hover, accents |
| `--accent` | Vermelho | Gradientes secundários |
| `--secondary` | Verde | Destaque adicional |
| `--border` | Cinza suave | Bordas, divisores |

---

## Efeitos por Contexto

### Botões CTA (Call-to-Action)
```html
<button class="btn-gradient-subtle btn-glow">Comece Agora</button>
```

### Botões Secundários
```html
<button class="btn-gradient-minimal">Saiba Mais</button>
```

### Menu Items (Navbar)
```html
<a href="#" class="navbar-item hover:text-primary transition-colors">
  Documentação
</a>
```

### Cards Informativos
```html
<div class="card-premium border rounded-lg p-6">
  Conteúdo do card
</div>
```

---

## Notas Importantes

1. **Sutil**: Todos os efeitos usam opacidades baixas (0.05 a 0.25) para não cansar a visão
2. **Performance**: Usa `transition` ao invés de animações contínuas
3. **Dark Mode**: Todos os efeitos têm variações para `.dark`
4. **Acessibilidade**: Mantém contraste suficiente (WCAG AA)
5. **Consistência**: Usa variáveis CSS do projeto (primary, accent, background, etc)

---

## Próximos Passos

Para aplicar completamente:

1. Atualize o `AppLayout.vue` com `.navbar-premium` no header
2. Atualize o componente Sidebar com `.sidebar-premium`
3. Aplique `.btn-gradient-subtle` em botões CTA principais
4. Aplique `.card-premium` em cards informativos
5. Teste em dark mode para garantir que ficou adequado
