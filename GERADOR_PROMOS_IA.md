# 🤖 Gerador de Promoções com IA - Guia Completo

## ✨ O que foi criado

Sistema automático de geração de promoções usando **Perplexity AI** que:

- ✅ Cole um link ou nome do produto
- ✅ IA gera automaticamente: título, descrição, desconto
- ✅ Busca imagens relacionadas
- ✅ Pré-carrega tudo no formulário
- ✅ Um clique e adiciona ao painel

---

## 🚀 Como Usar

### 1. Acesse o Painel
```
http://localhost:5173/test-visuals
↓
Scroll para cima (topo do painel)
↓
Você verá o card "🤖 Gerador de Promoções com IA"
```

### 2. Exemplo: Seu Anúncio do Soyo
```
Cole o Link: https://s.click.aliexpress.com/e/_c3bJkjYV

OU preenchao:
- Nome: Soyo Motherboard AMD B550M
- Preço Atual: 425.99
- Preço Original: 851.98

Clique: "Gerar Promoção com IA"
```

### 3. Resultado Automático
A IA vai gerar:
```
✅ Título atrativo
✅ Descrição técnica completa
✅ Desconto calculado automaticamente (50%)
✅ Link de compra preenchido
✅ Imagens buscadas (se disponível)
```

### 4. Revisão e Publicação
- Edite qualquer campo se necessário
- Adicione mais fotos manualmente se quiser
- Clique "Adicionar ao Painel"

---

## 📋 Estrutura do Formulário

### Campos de Entrada
```
┌─────────────────────────────────────┐
│ Link do Produto (URL)               │  ← Cole seu link do AliExpress
│ Nome do Produto                     │
│ Preço Atual (BRL)                   │
│ Preço Original (BRL)                │
└─────────────────────────────────────┘
        ↓
    [Gerar com IA]
        ↓
┌─────────────────────────────────────┐
│ ✅ Promoção Gerada                  │
│                                     │
│ Título (editável)                   │
│ Descrição (editável)                │
│ Desconto (editável)                 │
│ Link (editável)                     │
│ Imagens (visualizar/adicionar)      │
│                                     │
│ [Adicionar ao Painel] [Nova Promo]  │
└─────────────────────────────────────┘
```

---

## 🎯 Casos de Uso

### Caso 1: Com Link do AliExpress
```
Cole: https://s.click.aliexpress.com/e/_c3bJkjYV
     ↓
IA busca no link informações sobre:
- Nome do produto
- Especificações técnicas
- Preço
- Imagens
     ↓
Gera promoção completa com tudo preenchido
```

### Caso 2: Sem Link (Só Nome)
```
Nome: Soyo Motherboard AMD B550M
Preço: 425.99
Original: 851.98
     ↓
IA busca informações técnicas reais
     ↓
Gera descrição profissional com specs
```

### Caso 3: Múltiplas Promoções
```
Gerar Promo 1 → Adicionar ao Painel
             ↓
Clica "Nova Promoção"
             ↓
Gerar Promo 2 → Adicionar ao Painel
             ↓
Repete quantas vezes quiser
```

---

## 🔧 O que a IA Faz

### Análise do Link
Se você fornecer um link:
1. **Busca informações técnicas** na página
2. **Extrai nome do produto**
3. **Encontra preços** (atual e original)
4. **Coleta especificações** (socket, RAM, capacidade, etc)

### Geração de Conteúdo
Cria automaticamente:

#### Título (60 caracteres)
```
"Soyo Motherboard AMD B550M - 50% OFF Gaming"
```

#### Descrição (200 caracteres)
```
"Placa-mãe para jogos USB3.2, PCIe3.0, M.2 NVMe 
duplo canal DDR4. Suporta Ryzen 5700X. Performance 
comprovada para gaming e edição."
```

#### Desconto
Calcula automaticamente: `(Original - Atual) / Original * 100`

---

## 📸 Busca de Imagens

### Como Funciona
1. **Pega a URL fornecida**
2. **Busca imagens relacionadas**
3. **Retorna URLs de imagens** (até 3-5)
4. **Você revisa antes de publicar**

### Adicionar Imagens Manualmente
Se quiser mais imagens:
1. Clique "+ Adicionar Foto"
2. Cole a URL da imagem
3. Pronto! Vai aparecer na promoção

### Remover Imagens
Clique o **X** em cima da imagem para remover

---

## 💡 Dicas Importantes

### Para Melhores Resultados
1. **Cole links completos** (com seu código de afiliado)
2. **Preencha preços corretos** (IA calcula desconto baseado nisso)
3. **Revise o título** (às vezes pode estar longo)
4. **Adicione fotos** se a IA não encontrar

### O que Apareça na Página Pública
Tudo que você configurar aparece em `/promocoes`:
- ✅ Título e descrição
- ✅ Percentual de desconto (grande e destacado)
- ✅ Imagens em galeria
- ✅ Datas de validade
- ✅ Botão "COMPRAR AGORA" com seu link

---

## 📊 Exemplo Completo

### Entrada
```json
{
  "productLink": "https://s.click.aliexpress.com/e/_c3bJkjYV",
  "productName": "Soyo Motherboard AMD B550M",
  "productPrice": 425.99,
  "originalPrice": 851.98
}
```

### Saída da IA
```json
{
  "titulo": "Soyo Motherboard AMD B550M - 50% OFF Gaming Profissional",
  "descricao": "Placa-mãe DDR4 AM4 com USB3.2, PCIe3.0, M.2 NVMe duplo canal. Suporta Ryzen 5700X. Performance comprovada para gaming, edição 4K e multitarefa profissional.",
  "desconto": 50,
  "linkCompra": "https://s.click.aliexpress.com/e/_c3bJkjYV",
  "fotos": [
    "https://example.com/mothboard1.jpg",
    "https://example.com/mothboard2.jpg"
  ]
}
```

### Resultado na Página Pública
```
┌─────────────────────────────┐
│         50%                 │
│       DESCONTO              │
├─────────────────────────────┤
│ Soyo Motherboard AMD B550M  │
│ - 50% OFF Gaming Profissional│
│                             │
│ [Foto] [Foto]               │
│                             │
│ Placa-mãe DDR4 AM4...       │
│ 📅 12/11 a 31/12            │
│ ✅ Ativa agora              │
│ 49 dias restantes           │
│                             │
│ [COMPRAR AGORA] →           │
│ (abre seu link AliExpress)  │
└─────────────────────────────┘
```

---

## 🔌 Integração Técnica

### API Backend
- **Arquivo**: `/api/generate-promo.js`
- **Endpoint**: `POST /api/generate-promo`
- **Serviço de IA**: Perplexity (com fallback para Gemini)

### Componente Frontend
- **Arquivo**: `src/components/PromoGeneratorAI.vue`
- **Integrado em**: `PromoInfoPanel.vue`
- **Rota**: `/test-visuals`

### Fluxo de Dados
```
Usuário Input
    ↓
PromoGeneratorAI.vue (Frontend)
    ↓
/api/generate-promo (Backend)
    ↓
Perplexity API (IA)
    ↓
Resposta com promoção completa
    ↓
Usuário revisa e clica "Adicionar"
    ↓
savePromo() (Firebase)
    ↓
Aparece em /promocoes
```

---

## ✅ Checklist de Uso

- [ ] Acesse `/test-visuals`
- [ ] Veja o card "🤖 Gerador de Promoções com IA"
- [ ] Cole um link (ex: seu anúncio do AliExpress)
- [ ] Clique "Gerar Promoção com IA"
- [ ] Aguarde alguns segundos (IA processando)
- [ ] Revise o resultado gerado
- [ ] Adicione fotos se necessário
- [ ] Clique "Adicionar ao Painel"
- [ ] Vá em `/promocoes` para ver o resultado público
- [ ] Compartilhe o link nas redes sociais!

---

## 🚨 Troubleshooting

### "Erro ao gerar promoção"
- Verifique se o link está correto
- Ou preencha pelo menos o nome do produto
- Recarregue a página e tente novamente

### "Imagens não aparecem"
- A busca de imagens é opcional
- Você pode adicionar manualmente clicando "+ Adicionar Foto"
- Cole URLs de imagens do seu servidor ou de CDNs

### "Texto da IA parece errado"
- Edite diretamente no formulário
- Cada campo é editável antes de publicar
- Você tem controle total sobre o conteúdo

### "Promoção não aparece em /promocoes"
- Verifique se marcou "Ativo"
- Confirme as datas (início deve ser hoje ou antes)
- Recarregue a página com Ctrl+F5

---

## 📈 Próximas Melhorias

- [ ] Upload de imagens (sem precisar de URL)
- [ ] Integração com Canva para design automático
- [ ] Agendamento de promoções
- [ ] A/B testing de títulos
- [ ] Analytics de performance
- [ ] Integração direta com inventário

---

## 📞 Resumo

Este sistema torna **ridiculamente fácil** criar promoções:

1. **Antes**: Preencher 10 campos manualmente, buscar imagens, escrever descrição técnica
2. **Agora**: Cola um link → Clica um botão → Pronto!

**Tempo economizado**: ~5 minutos por promoção  
**Qualidade**: Conteúdo profissional gerado por IA  
**Flexibilidade**: Edita qualquer coisa antes de publicar

---

**Status:** ✅ Pronto para usar  
**Data:** 12/11/2025  
**IA:** Perplexity + Gemini (fallback)
