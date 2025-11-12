# 🎁 Guia Completo - Página de Promoções TechVerse

## ✨ O que foi criado

Sistema completo para gerenciar e publicar promoções com desconto, datas, filtros e design responsivo.

### 📁 Arquivos Criados/Modificados

1. **`src/views/PromosPage.vue`** - Página pública de promoções
   - Busca por texto
   - Filtro por status (ativa, terminando, próxima)
   - Ordenação (maior desconto / terminando em breve)
   - Display de desconto em grande escala
   - Dias restantes com alerta
   - Design responsivo com dark mode
   
2. **`src/router/index.js`** - Rota adicionada
   - `/promocoes` → Página de promoções públicas

3. **`src/components/ui/SidebarMenu.vue`** - Link adicionado
   - "Gerenciar Notícias e Promoções" aponta para `/test-visuals`

---

## 🚀 Como Usar

### 1. **Acessar o Painel de Gerenciamento**

```
1. Acesse: http://localhost:5173/test-visuals
2. Scroll até "📢 Promoções & Notícias"
3. Clique na aba "🎁 Promoções"
```

### 2. **Criar uma Nova Promoção**

```
1. Clique em "Nova Promoção"
2. Preencha os campos:
   ├─ Título: "Black Friday 2024"
   ├─ Descrição: "Descrição da promoção"
   ├─ Desconto (%): 50
   ├─ Data Início: 2024-11-01
   ├─ Data Fim: 2024-11-30
   └─ Ativo? (marque para ativar)
3. Clique "💾 Salvar"
```

### 3. **Exemplos de Promoções**

#### Promoção Relâmpago
```
Título: Promoção Black Friday - 50% OFF
Descrição: Oferta especial válida apenas este fim de semana
Desconto: 50%
Data Início: 2024-11-29
Data Fim: 2024-12-02
Ativo: ✓
```

#### Promoção de Longo Prazo
```
Título: Desconto Progressivo - Quanto Mais Compra Mais Economiza
Descrição: 10% em 1 item, 20% em 2 itens, 30% em 3+ itens
Desconto: 30%
Data Início: 2024-11-01
Data Fim: 2024-12-31
Ativo: ✓
```

#### Promoção Sazonal
```
Título: Liquidação de Estoque - Produto XYZ
Descrição: Últimas unidades com mega desconto
Desconto: 70%
Data Início: 2024-11-15
Data Fim: 2024-11-20
Ativo: ✓
```

---

## 🌐 Acessar a Página de Promoções

### URL Pública
```
http://localhost:5173/promocoes
```

### Funcionalidades da Página

#### Busca
- Procura por título ou descrição
- Em tempo real
- Case-insensitive

#### Filtros por Status
- **Todas as promoções**: Mostra todas ativas
- **Ativas agora**: Promoções em vigência no momento
- **Terminando**: Promoções com 7 dias ou menos restantes
- **Próximas**: Promoções que ainda não começaram

#### Ordenação
- **Maior Desconto**: Ordena por % de desconto (decrescente)
- **Terminando em Breve**: Ordena pelas que vencem primeiro

#### Informações por Card
- Grande display do % de desconto
- Título da promoção
- Descrição resumida
- Datas de início e fim
- Status visual (Próxima ⏳ / Ativa agora ✅ / Finalizada ❌)
- Dias restantes com alerta
- Botão "Aproveitar Promoção"

---

## 📊 Estrutura Firestore

### Collection: `promos`

```javascript
promos/{id}
├── titulo: string              // Título da promoção
├── descricao: string           // Descrição detalhada
├── desconto: number            // Percentual de desconto (0-100)
├── dataInicio: timestamp       // Data de início
├── dataFim: timestamp          // Data de fim
├── ativo: boolean              // true = ativa, false = inativa
├── criadoEm: timestamp         // Data de criação
└── atualizadoEm: timestamp     // Data da última edição
```

---

## 🎯 Status de Promoção

| Status | Ícone | Condição | Aparência |
|--------|-------|----------|-----------|
| **Próxima** | ⏳ | Data início > agora | Badge outline (cinza) |
| **Ativa agora** | ✅ | Data início <= agora <= data fim | Badge primary (colorida) |
| **Finalizada** | ❌ | Data fim < agora | Badge secondary (desbotada) |

---

## 💡 Dicas Importantes

### 1. **Títulos Eficazes**
```
❌ "Desconto"
✅ "Black Friday: 50% de Desconto em Todos os Produtos"

❌ "Promoção"
✅ "Liquidação Final - Estoque Limitado: Até 70% OFF"
```

### 2. **Descrições Descritivas**
```
❌ "Ótima oferta"
✅ "Desconto progressivo: 10% em 1 item, 20% em 2 itens, 
   30% em 3 ou mais itens. Válido para compras acima de R$ 100"
```

### 3. **Datas Realistas**
- Sempre defina datas reais
- Não crie promoções vencidas
- Deixe pelo menos 1 dia entre criação e início

### 4. **Percentual de Desconto**
- 0-15%: Desconto pequeno
- 15-30%: Desconto bom
- 30-50%: Desconto excelente
- 50%+: Desconto impressionante (raro)

### 5. **Frequência de Promoções**
- **Mínimo**: 1 vez por mês
- **Ideal**: 2-3 por mês
- **Máximo**: 1 por semana (risco de perder valor)

---

## 🔍 Como Aumentar Conversão de Promoções

1. **Urgência**: Use "Terminando em X dias"
2. **Desconto atrativo**: Quanto maior, mais cliques
3. **Descrição clara**: Explique o que está em promoção
4. **Timing certo**:
   - Sextas-feiras antes de feriados
   - Datas comemorativas
   - Fim de estação
5. **Público-alvo**: Crie promoções específicas

---

## 🔐 Firestore Rules

As promoções estão protegidas pelas regras existentes:

```javascript
// Leitura pública para promoções
match /promos/{document=**} {
  allow read: if true;  // Qualquer um vê
  allow write: if request.auth.uid != null && isAdmin();  // Só admins editam
}
```

---

## 📱 Compatibilidade

| Device | Status | Notas |
|--------|--------|-------|
| Desktop | ✅ | Layout ideal |
| Tablet | ✅ | 2 colunas |
| Mobile | ✅ | 1 coluna, responsivo |
| Dark Mode | ✅ | Automático |

---

## 🐛 Troubleshooting

### "Promoção não aparece na página pública"
```
✅ Verifique se o campo "ativo" está marcado ✓
✅ Verifique se a data de início é hoje ou anterior
✅ Verifique se a data de fim é hoje ou posterior
✅ Recarregue a página (Ctrl+F5)
```

### "Desconto não aparece grande"
```
✅ Verifique se preencheu o campo "Desconto (%)"
✅ Use um número entre 0 e 100
✅ Não use símbolos como "%", apenas números
```

### "Filtro não funciona"
```
✅ Verifique se todas promoções têm datas válidas
✅ Recarregue a página
✅ Abra console (F12) para erros
```

---

## 🚀 Melhorias Futuras

Possíveis funcionalidades a adicionar:

- [ ] **Código de cupom** - Gerar códigos automáticos
- [ ] **Imagem da promoção** - Destaque visual
- [ ] **Categorias** - Agrupar promoções
- [ ] **Público específico** - Promoções por cliente
- [ ] **Limite de quantidade** - Apenas N produtos
- [ ] **Email automático** - Notificar quando iniciar
- [ ] **Compartilhamento** - Share em redes sociais
- [ ] **Analytics** - Rastrear cliques
- [ ] **Cupom de desconto** - Integração com e-commerce
- [ ] **Notifications** - Push quando vai terminar

---

## 📈 Métricas de Sucesso

Acompanhe estas métricas:

1. **Total de Promoções Ativas**: Quantas promoções rodando?
2. **Cliques por Promoção**: Campo "Aproveitar Promoção"
3. **Taxa de Conversão**: Cliques vs. vendas geradas
4. **Desconto Médio**: Qual é o desconto típico?
5. **Tempo de Validade**: Qual duração funciona melhor?

---

## 🔗 Rotas

| Rota | Componente | Descrição |
|------|-----------|-----------|
| `/promocoes` | PromosPage | Página pública |
| `/test-visuals` | TestVisualsView | Painel administrativo (aba Promoções) |

---

## 📞 Suporte

### Acessar a página
```
http://localhost:5173/promocoes
```

### Gerenciar promoções
```
http://localhost:5173/test-visuals → Aba "🎁 Promoções"
```

### Firestore Console
```
https://console.firebase.google.com
→ Firestore Database → Collection "promos"
```

---

## 🎯 Próximas Ações Recomendadas

1. **Hoje**: Crie 2-3 promoções de teste
2. **Esta semana**: Publique sua primeira promoção real
3. **Este mês**: Crie um calendário de promoções
4. **Este trimestre**: Integre com email/WhatsApp

---

**Data de Criação:** 12/11/2025  
**Última Atualização:** 12/11/2025  
**Status:** ✅ Pronto para Produção
