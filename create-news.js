
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { firebaseConfig } from './src/firebase/config.js';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const newsData = {
    titulo: "5 Formas de Perder Clientes por Má Gestão",
    categoria: "tutorial",
    imagem: "/images/news/lost-clients.png",
    conteudo: `## 📌 Introdução

A gestão de clientes é o coração de qualquer negócio de serviços. Uma má gestão não apenas prejudica seu faturamento, mas também prejudica sua reputação no mercado.

Neste artigo, vamos explorar as 5 principais formas como você pode estar perdendo clientes sem nem perceber. Confira!

---

## 1️⃣ Falta de Comunicação Clara e Oportuna

### O Problema
Clientes que não sabem o status de seus serviços ficam ansiosos e desconfiados.

**Situação Real:**
- Cliente encomenda uma manutenção na segunda-feira
- Ninguém avisa quando será feito
- Cliente fica dias sem saber o andamento
- Cliente vai para seu concorrente

### ✅ A Solução
Com o **TechVerse**, você pode:
- Enviar atualizações automáticas do status do serviço
- Manter todo histórico de comunicação centralizado
- Registrar cada etapa do trabalho em tempo real
- Cliente vê tudo via portal

---

## 2️⃣ Cobranças Confusas ou Erros de Preço

### O Problema
Se o cliente não entende a sua fatura ou encontra erros repetidos, ele desaparece.

**Situação Real:**
- "Por que foi cobrado R$ 250 se eu falei R$ 150?"
- Falta de nota fiscal ou recibo claro
- Preços diferentes para o mesmo serviço

### ✅ A Solução
Com o **TechVerse + Módulo Financeiro**, você pode:
- Gerar orçamentos claros antes do serviço
- Sistema de preços consistente
- Rastreamento automático de custos
- Notas fiscais integradas
- Cliente vê exatamente do que está pagando

---

## 3️⃣ Perda de Informações do Cliente

### O Problema
Quando você não organiza dados dos clientes, perde oportunidades.

**Situação Real:**
- "Qual era a preferência desse cliente?"
- Não tem histórico de serviços anteriores
- Não sabe quando foi o último atendimento
- Cliente sente-se como um número

### ✅ A Solução
Com o **TechVerse**, cada cliente tem:
- Perfil completo centralizado
- Histórico completo de serviços
- Preferências e anotações pessoais
- Próximos serviços recomendados
- Data do último atendimento
- Cliente sente-se valorizado e conhecido

---

## 4️⃣ Agendamentos Confusos ou Perdidos

### O Problema
Clientes que não conseguem marcar horário facilmente vão para outro lugar.

**Situação Real:**
- "Qual é seu horário de funcionamento?"
- Conflito de agendamentos (dois clientes no mesmo horário)
- Cliente marca e você esquece
- Fila de espera desorganizada

### ✅ A Solução
Com o **TechVerse**, você oferece:
- Agenda clara e organizada
- Cliente vê disponibilidade em tempo real
- Sem conflitos de agendamento
- Lembretes automáticos para o cliente
- Sistema de fila transparente
- Agendamento 24/7, sem você fazer nada

---

## 5️⃣ Falta de Visão Geral do Negócio

### O Problema
Se você não sabe seus números, não pode melhorar.

**Situação Real:**
- "Quanto ganhei este mês?"
- Não sabe qual cliente é mais lucrativo
- Não sabe qual serviço gera mais receita
- Toma decisões no escuro

### ✅ A Solução
Com o **TechVerse Dashboard**, você vê:
- Receita total do mês
- Lucro real (receita - custo dos produtos)
- Margem de cada serviço
- Cliente mais lucrativo
- Serviço mais procurado
- Tendências e padrões

---

## 🎯 Resumo: Como o TechVerse Resolve Tudo Isso

| Problema | Solução TechVerse |
|----------|-------------------|
| Comunicação confusa | Status automático em tempo real |
| Cobranças erradas | Sistema financeiro preciso |
| Perda de dados | CRM centralizado |
| Agendamentos confusos | Agenda inteligente |
| Falta de visão | Dashboard com métricas claras |

---

## 🚀 Comece Agora

A boa notícia? Você não precisa reinventar a roda.

Com o **TechVerse**, você resolve tudo isso em uma única plataforma. Sem papéis perdidos, sem planilhas confusas, sem atrasos.

### Próximos Passos:
1. **Teste grátis por 30 dias** - Sem cartão de crédito
2. **Configure seus clientes** - Leva 10 minutos
3. **Comece a organizar** - Veja a diferença no primeiro dia
4. **Acompanhe seus números** - Dashboard automático

---

## 💬 Perguntas Frequentes

**P: Quanto tempo leva para aprender a usar?**  
R: 30 minutos. É bem intuitivo.

**P: Posso importar meus clientes antigos?**  
R: Sim, fazemos a importação para você.

**P: E se mudar de ideia?**  
R: Seus dados são sempre seus. Sem retenção.

---

**Não deixe mais seus clientes irem embora por má gestão.**  
**Teste o TechVerse hoje mesmo e veja a diferença.**`,
    dataPub: new Date(),
    views: 0,
    ativo: true,
    criadoEm: new Date()
};

async function createNews() {
    try {
        const docRef = await addDoc(collection(db, 'noticias'), newsData);
        console.log("Document written with ID: ", docRef.id);
    } catch (e) {
        console.error("Error adding document: ", e);
    }
}

createNews();
