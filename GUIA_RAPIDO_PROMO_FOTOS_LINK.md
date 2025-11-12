# 🎁 Guia Rápido - Promoções com Fotos e Links

## ✨ O que foi adicionado

### Novos campos no painel administrativo:
- **URL de Compra** - Link direto para comprar (ex: seu link de afiliado)
- **Fotos da Promoção** - Múltiplas imagens/URLs que aparecem no card

---

## 🚀 Como Criar uma Promoção Completa

### Passo 1: Acessar o Painel
```
http://localhost:5173/test-visuals
↓
Scroll até "📢 Promoções & Notícias"
↓
Aba "🎁 Promoções"
↓
Clique em "Nova Promoção"
```

### Passo 2: Preencher o Formulário

#### Campos Básicos
- **Título**: "Soyo Motherboard AMD B550M - 50% OFF"
- **Descrição**: "Placa-mãe para jogos com USB3.2, PCIe3.0, M.2 NVMe duplo canal DDR4"
- **Desconto (%)**: 50
- **Data Início**: 2025-11-12
- **Data Fim**: 2025-12-31

#### Novo: URL de Compra
```
https://s.click.aliexpress.com/e/_c3qZpQup
```
(Adicione seu link com código de afiliado aqui)

#### Novo: Fotos da Promoção
```
1. Clique "+ Adicionar Foto"
2. Cole o URL da foto:
   https://exemplo.com/foto1.jpg
3. Clique "+ Adicionar Foto" novamente para mais fotos
```

#### Status
- ✓ Marque "Promoção Ativa" para publicar

### Passo 3: Salvar
Clique "💾 Salvar" e pronto!

---

## 📱 Como Será Exibido

### No Painel Admin (http://localhost:5173/test-visuals)
```
┌─────────────────────────┐
│ 💰 Desconto: 50%        │
│ 📅 12/11/2025           │
├─────────────────────────┤
│ [Foto 1] [Foto 2]       │  ← Suas fotos em miniatura
├─────────────────────────┤
│ ✏️ Editar               │
│ 🔴 Desativar            │
│ 🗑️  Deletar             │
└─────────────────────────┘
```

### Na Página Pública (http://localhost:5173/promocoes)
```
┌──────────────────────────────┐
│        50%                    │
│      Desconto                 │
├──────────────────────────────┤
│ Soyo Motherboard AMD B550M    │
│ Placa-mãe para jogos...       │
├──────────────────────────────┤
│ [Foto] [Foto] [Foto]          │  ← Galeria de fotos
├──────────────────────────────┤
│ 📅 12/11 a 31/12             │
│ ✅ Ativa agora                │
│ 7 dias restantes             │
├──────────────────────────────┤
│  [COMPRAR AGORA] 🎯          │  ← Vai abrir seu link
└──────────────────────────────┘
```

---

## 💡 Exemplo Completo - Seu Anúncio

```
Título: 
Soyo Motherboard AMD B550M - 50% OFF

Descrição:
Placa-mãe para jogos USB3.2, PCIe3.0, M.2 NVMe duplo canal DDR4, suporta Ryzen 5700X. 
Preço: BRL 425.99 (Original: BRL 851.98)

Desconto: 50

Data Início: 12/11/2025
Data Fim: 31/12/2025

URL de Compra:
https://s.click.aliexpress.com/e/_c3qZpQup

Fotos (adicione 2-3 fotos):
- https://exemplo.com/motherboard1.jpg
- https://exemplo.com/motherboard2.jpg
- https://exemplo.com/motherboard3.jpg

Ativo: ✓
```

---

## 📋 Dicas Importantes

### Para Fotos
- Usar URLs diretos de imagens (terminar em .jpg, .png, .webp)
- Tamanho recomendado: 400x400px mínimo
- Pode ser de:
  - Seu site
  - AliExpress
  - Imgur
  - Cloudinary
  - Qualquer CDN de imagens

### Para Links de Compra
- Suporta qualquer URL
- Exemplo com código de afiliado: `https://s.click.aliexpress.com/e/_codigo`
- O botão abrirá em nova aba (não sai do seu site)

### Quando Remover Fotos
- Deixe o campo vazio e clique o X ao lado
- A foto será removida

---

## 🔄 Fluxo Completo

1. **Criar Promoção** no painel
2. **Adicionar URL de compra** (seu link com afiliado)
3. **Adicionar fotos** da promoção
4. **Publicar** (marcar como ativa)
5. **Verificar** em /promocoes (página pública)
6. **Compartilhar** o link /promocoes nas redes sociais

---

## 🎯 Resultado Final

Quando você entra em `/promocoes`, seus clientes verão:
- ✅ Fotos do produto
- ✅ Título e descrição
- ✅ Percentual de desconto em destaque
- ✅ Datas válidas
- ✅ Status (Ativa / Terminando / Próxima)
- ✅ Botão "COMPRAR AGORA" que vai direto pro AliExpress

---

## 🔧 Se Algo Não Aparecer

### Fotos não aparecem
- Verifique se a URL está correta
- Teste a URL no navegador
- Recarregue a página (Ctrl+F5)

### Link não funciona
- Teste o link em novo navegador
- Verifique se começa com `https://`
- Certifique-se de copiar corretamente

### Promoção não aparece em /promocoes
- Verifique se "Ativo" está marcado
- Verifique a data de início (deve ser hoje ou antes)
- Verifique a data de fim (deve ser hoje ou depois)
- Recarregue a página

---

## 📞 Próximas Melhorias

Possíveis adições futuras:
- [ ] Upload de imagens (sem precisar de URL)
- [ ] Galeria com zoom
- [ ] Código de cupom automático
- [ ] Visualização em tempo real
- [ ] Analytics de cliques

---

**Status:** ✅ Pronto para usar  
**Data:** 12/11/2025
