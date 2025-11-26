# 📊 Exportador de Dados - TechVerse

## ✅ Sistema Completo de Exportação Implementado

---

## 🎯 Funcionalidades

### **1. Exportação Individual**

Exporte cada tipo de dado separadamente:

✅ **Clientes**
- Nome, Email, Telefone

✅ **Ordens de Serviço**
- Cliente, Data, Valores, Observações, Configuração

✅ **Inventário**
- Nome, Tipo, Preço Custo, Preço Venda, Quantidade

✅ **Catálogo de Serviços**
- Nome, Descrição, Preço

### **2. Backup Completo**

Exporte **TODOS** os dados de uma vez:
- Arquivo Excel com múltiplas abas
- Arquivo JSON estruturado

---

## 📁 Formatos Disponíveis

### **XLSX (Excel)** ⭐ Recomendado

```
Clientes_20250109_1430.xlsx
```

✅ Abre no Excel, Google Sheets, LibreOffice  
✅ Formatação preservada  
✅ Múltiplas abas (no backup completo)  
✅ Profissional e universal  

**Quando usar:**
- Análise de dados
- Relatórios
- Apresentações
- Compartilhar com contador/administrativo

---

### **CSV (Comma Separated Values)**

```
Clientes_20250109_1430.csv
```

✅ Formato simples e leve  
✅ Importa em qualquer sistema  
✅ Compatível com bancos de dados  

**Quando usar:**
- Importar para outro sistema
- Processar com scripts
- Migração de dados

---

### **JSON (JavaScript Object Notation)**

```
Clientes_20250109_1430.json
```

✅ Backup completo com estrutura  
✅ Dados hierárquicos preservados  
✅ Ideal para restauração  

**Quando usar:**
- Backup técnico completo
- Migração entre sistemas
- Desenvolvimento/debugging

---

## 🚀 Como Usar

### **Passo 1: Acessar**

Menu lateral → **📊 Exportar Dados**

### **Passo 2: Escolher Tipo**

Clique no card do tipo de dado que deseja exportar:
- Clientes
- Ordens de Serviço
- Inventário
- Catálogo de Serviços
- **Backup Completo**

### **Passo 3: Escolher Formato**

Clique no botão do formato desejado:
- Excel (.xlsx)
- CSV
- JSON

### **Passo 4: Download Automático**

O arquivo é baixado automaticamente com nome:
```
TipoDados_AAAAMMDD_HHMM.formato

Exemplos:
Clientes_20250109_1430.xlsx
Ordens_Servico_20250109_1432.csv
Backup_Completo_20250109_1435.xlsx
```

---

## 📊 Estrutura dos Arquivos

### **Excel (XLSX) - Clientes**

| ID | Nome | Email | Telefone |
|----|------|-------|----------|
| abc123 | João Silva | joao@email.com | (11) 98765-4321 |
| def456 | Maria Santos | maria@email.com | (11) 91234-5678 |

### **Excel (XLSX) - Ordens de Serviço**

| ID | Cliente | Data | Valor do Serviço | Valor Total | Observações |
|----|---------|------|------------------|-------------|-------------|
| os1 | João Silva | 09/01/2025 | 150.00 | 250.00 | Formatação; Limpeza |
| os2 | Maria Santos | 08/01/2025 | 300.00 | 450.00 | Troca de HD; RAM |

### **Excel (XLSX) - Inventário**

| ID | Nome | Tipo | Preço de Custo | Preço de Venda | Quantidade |
|----|------|------|----------------|----------------|------------|
| item1 | Kingston 8GB DDR4 | ram | 150.00 | 220.00 | 5 |
| item2 | SSD 240GB | armazenamento | 180.00 | 280.00 | 3 |

### **Backup Completo (XLSX)**

Arquivo com **4 abas**:
1. **Clientes** - Todos os clientes
2. **Ordens de Serviço** - Todas as ordens
3. **Inventário** - Todo o inventário
4. **Catálogo Serviços** - Catálogo completo

### **JSON Estruturado**

```json
{
  "dataExportacao": "2025-01-09T14:30:00.000Z",
  "storeId": "user123abc",
  "clientes": [
    {
      "id": "abc123",
      "nome": "João Silva",
      "email": "joao@email.com",
      "telefone": "(11) 98765-4321"
    }
  ],
  "ordensServico": [...],
  "inventario": [...],
  "catalogoServicos": [...]
}
```

---

## 🔒 Segurança Multi-Tenant

✅ **Isolamento Total**
- Cada usuário exporta APENAS seus próprios dados
- Impossível exportar dados de outros usuários

✅ **Validação de Autenticação**
- Verifica `storeId` antes de exportar
- Requer login ativo

✅ **Estrutura Segura**
```
stores/{userId}/clientes     ← Seus clientes
stores/{userId}/ordens_servico  ← Suas ordens
stores/{userId}/items        ← Seu inventário
```

---

## 💡 Casos de Uso

### **📈 Relatórios Mensais**

1. Exportar **Ordens de Serviço** em Excel
2. Filtrar por mês no Excel
3. Criar gráficos e análises

### **💾 Backup Periódico**

1. Todo mês: **Backup Completo** em JSON
2. Guardar em local seguro (Google Drive, Dropbox)
3. Restauração em caso de necessidade

### **📊 Análise Financeira**

1. Exportar **Inventário** em Excel
2. Calcular valor total em estoque
3. Analisar margem de lucro

### **📧 Enviar para Contador**

1. Exportar **Ordens de Serviço** em Excel
2. Enviar por email
3. Contador processa faturamento

### **🔄 Migrar para Outro Sistema**

1. Exportar **Backup Completo** em JSON
2. Importar no novo sistema
3. Migração sem perda de dados

---

## 🛠️ Tecnologias Usadas

**Biblioteca:** SheetJS (`xlsx`)
- 📦 Mais popular para Excel em JavaScript
- ✅ Suporta XLSX, CSV, JSON
- 🚀 Rápida e confiável
- 📖 Bem documentada

**Recursos:**
- `json_to_sheet` - Converte JSON para planilha
- `book_new` - Cria novo workbook
- `book_append_sheet` - Adiciona abas
- `writeFile` - Salva arquivo localmente

---

## ⚡ Performance

| Tipo | Quantidade | Tempo Estimado |
|------|------------|----------------|
| Clientes | 100 | < 1 segundo |
| Clientes | 1.000 | ~2 segundos |
| Clientes | 10.000 | ~5 segundos |
| Backup Completo | 1.000 registros | ~3 segundos |

**Otimizado para:**
- Exportações rápidas
- Processamento no navegador (sem servidor)
- Baixo uso de memória

---

## 🔮 Melhorias Futuras (Opcional)

- [ ] Filtrar por data antes de exportar
- [ ] Escolher colunas específicas
- [ ] Exportar como PDF
- [ ] Agendamento automático de backups
- [ ] Upload para Google Drive/Dropbox
- [ ] Email automático de backup
- [ ] Histórico de exportações

---

## ❓ FAQ

### **Onde os arquivos são salvos?**

Na pasta de Downloads do navegador (padrão do sistema).

### **Os dados ficam no servidor?**

Não! Toda exportação é processada no navegador. Nada é enviado para servidor.

### **Posso editar o Excel exportado?**

Sim! É um arquivo Excel normal, pode editar à vontade.

### **Como importar de volta?**

Atualmente não há importador. Use JSON para backup/restauração manual.

### **Qual formato é melhor?**

- **Excel** para análise e relatórios
- **CSV** para importar em outros sistemas
- **JSON** para backup técnico completo

### **Tem limite de registros?**

Não! Exporta quantos registros tiver.

### **Funciona offline?**

Não. Precisa buscar dados do Firestore (online).

---

## 📝 Exemplos de Nomes de Arquivo

```
Clientes_20250109_1430.xlsx
Clientes_20250109_1430.csv
Clientes_20250109_1430.json

Ordens_Servico_20250109_1432.xlsx
Inventario_20250109_1435.csv
Catalogo_Servicos_20250109_1440.xlsx

Backup_Completo_20250109_1500.xlsx
Backup_Completo_20250109_1500.json
```

Formato: `Tipo_AAAAMMDD_HHMM.extensão`

---

## ✨ Resumo

✅ **5 tipos de exportação** (clientes, ordens, inventário, catálogo, backup)  
✅ **3 formatos** (Excel, CSV, JSON)  
✅ **Multi-tenant seguro** (só seus dados)  
✅ **Rápido** (processamento local)  
✅ **Profissional** (arquivos prontos para uso)  

**Localização:** Menu → 📊 Exportar Dados

---

**Implementado por:** Hugo, BLK Studio  
**Data:** 2025  
**Biblioteca:** SheetJS (xlsx)  
**Versão:** 1.0
