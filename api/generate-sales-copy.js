// api/generate-sales-copy.js

/**
 * Gera textos de marketing técnicos usando IA (Perplexity)
 * Busca informações técnicas reais da internet para criar conteúdo mais realista
 */

const systemPrompt = `Você é um especialista em copywriting de hardware de computador para marketplaces.
Crie 4 textos de marketing profissionais e técnicos para vender um componente de hardware.
Os textos devem incluir especificações técnicas reais, benefícios práticos e call-to-action.
Mantenha os textos naturais, persuasivos e com linguagem de vendedor experiente.

Retorne um JSON com a seguinte estrutura:
{
  "instagramPost": "texto para Instagram (150-200 caracteres, com emojis e hashtags)",
  "whatsappStatus": "texto para WhatsApp (curto e direto, 100 caracteres)",
  "facebookPost": "texto para Facebook (detalhado, 300-400 caracteres com emojis)",
  "emailMarketing": "email completo com assunto"
}

Não inclua markdown, código ou explicações. Apenas o JSON.`;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { item } = req.body;

    if (!item) {
      return res.status(400).json({ error: 'Nenhum item fornecido.' });
    }

    const PPLX_KEY = process.env.PERPLEXITY_API_KEY;
    const GEMINI_KEY = process.env.GEMINI_API_KEY;

    // Montar prompt de busca
    const searchPrompt = `Busque informações técnicas reais e atualizadas sobre: ${item.nome}
    
Se possível, consulte:
- Site do fabricante
- Kabum, Pichau ou outros e-commerce brasileiros
- Especificações técnicas: performance, compatibilidade, consumo

Com base nas informações encontradas, crie um texto de marketing profissional e persuasivo.

Informações do produto no nosso sistema:
- Preço: R$ ${(item.precoVenda || item.precoCusto || 0).toFixed(2)}
- Tipo: ${item.tipo || 'componente'}
- Descrição: ${item.descricao || 'Não informada'}

Gere 4 versões de marketing para diferentes plataformas.`;

    // Tentar com Perplexity (tem acesso a internet)
    if (PPLX_KEY) {
      try {
        console.log('Gerando marketing copy com Perplexity...');
        const salesCopy = await callPerplexity(searchPrompt, PPLX_KEY);
        return res.status(200).json(salesCopy);
      } catch (perplexityError) {
        console.error('Erro no Perplexity:', perplexityError.message);
        // Fallback para Gemini
      }
    }

    // Fallback para Gemini
    if (GEMINI_KEY) {
      try {
        console.log('Gerando marketing copy com Gemini (fallback)...');
        const salesCopy = await callGemini(searchPrompt, GEMINI_KEY, item);
        return res.status(200).json(salesCopy);
      } catch (geminiError) {
        console.error('Erro no Gemini:', geminiError.message);
        // Fallback final para templates
      }
    }

    // Fallback final: templates estáticos
    console.log('Usando templates estáticos (fallback final)...');
    const templatesPorTipo = {
      cpu: gerarTextoCPU,
      gpu: gerarTextoGPU,
      ram: gerarTextoRAM,
      'placa-mae': gerarTextoPlacaMae,
      armazenamento: gerarTextoArmazenamento,
      fonte: gerarTextoFonte,
      gabinete: gerarTextoGabinete,
      outro: gerarTextoGenerico,
    };

    const gerador = templatesPorTipo[item.tipo] || gerarTextoGenerico;
    const salesCopy = gerador(
      item.nome,
      item.precoVenda || item.precoCusto || 0,
      item.descricao || '',
      item.compatibilidade || {}
    );

    return res.status(200).json(salesCopy);

  } catch (error) {
    console.error('Erro ao gerar copy:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
}

// ============================================================================
// CHAMADAS DE API
// ============================================================================

async function callPerplexity(prompt, apiKey) {
  const response = await fetch('https://api.perplexity.ai/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'sonar',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt }
      ]
    })
  });

  if (!response.ok) {
    const errorDetails = await response.text();
    throw new Error(`Erro ${response.status} do Perplexity: ${errorDetails}`);
  }

  const data = await response.json();
  return JSON.parse(data.choices[0].message.content);
}

async function callGemini(prompt, apiKey, item) {
  const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-pro-preview:generateContent?key=${apiKey}`;

  const response = await fetch(GEMINI_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      contents: [{
        parts: [{ text: prompt }]
      }],
      generationConfig: {
        responseMimeType: "application/json",
      }
    })
  });

  if (!response.ok) {
    const errorDetails = await response.text();
    throw new Error(`Erro ${response.status} do Gemini: ${errorDetails}`);
  }

  const data = await response.json();
  const jsonString = data.candidates[0].content.parts[0].text;
  return JSON.parse(jsonString);
}

// ============================================================================
// TEMPLATES ESTÁTICOS (FALLBACK)
// ============================================================================

function gerarTextoCPU(nome, preco, descricao, compat) {
  const socket = compat.socket || 'Socket compatível';

  return {
    instagramPost: `⚡ PROCESSADOR EM DESTAQUE

${nome}

🔧 Especificações Técnicas:
• Socket: ${socket}
• Performance comprovada
• Ideal para gaming, edição e produtividade

💰 R$ ${preco.toFixed(2)}

📩 DM para orçamento
🔗 Link na bio

#ProcessadorGamer #PC #Hardware`,

    whatsappStatus: `⚡ ${nome}
Socket ${socket} | R$ ${preco.toFixed(2)}
Consulte: [seu contato]`,

    facebookPost: `[PROCESSADOR] ${nome}

Especificações:
→ Socket: ${socket}
→ Tecnologia moderna

Valor: R$ ${preco.toFixed(2)}

Atendimento especializado via WhatsApp`,

    emailMarketing: `Assunto: ${nome} - Upgrade de Performance

Olá,

O ${nome} oferece performance superior para seu sistema.

INVESTIMENTO: R$ ${preco.toFixed(2)}

Entre em contato para consultoria técnica.

[Sua Loja]`,
  };
}

function gerarTextoGPU(nome, preco, descricao, compat) {
  return {
    instagramPost: `🎮 PLACA DE VÍDEO

${nome}

🔥 Performance:
• Alta performance
• Ray tracing
• Ideal para 1080p/1440p/4K

💰 R$ ${preco.toFixed(2)}

📲 DM para specs

#GPU #PlacaDeVideo #PCGamer`,

    whatsappStatus: `🎮 ${nome}
R$ ${preco.toFixed(2)}
GPU de alta performance!`,

    facebookPost: `[PLACA DE VÍDEO] ${nome}

Performance gráfica profissional.

ESPECIFICAÇÕES:
→ Memória dedicada
→ Suporte a tecnologias modernas

Valor: R$ ${preco.toFixed(2)}

Atendimento técnico especializado`,

    emailMarketing: `Assunto: ${nome} - Performance Gráfica Premium

Prezado(a),

A ${nome} está disponível para upgrade.

INVESTIMENTO: R$ ${preco.toFixed(2)}

Nossa equipe verifica compatibilidade gratuitamente.

[Sua Loja]`,
  };
}

function gerarTextoRAM(nome, preco, descricao, compat) {
  const tipoRam = compat.tipoRam || 'DDR4/DDR5';

  return {
    instagramPost: `💾 MEMÓRIA RAM

${nome}

⚡ Especificações:
• Tipo: ${tipoRam}
• Performance otimizada
• Multitarefa fluida

💰 R$ ${preco.toFixed(2)}

#RAM #Memoria #UpgradePC`,

    whatsappStatus: `💾 ${nome}
${tipoRam} | R$ ${preco.toFixed(2)}
Boost imediato!`,

    facebookPost: `[MEMÓRIA RAM] ${nome}

Tipo: ${tipoRam}

BENEFÍCIOS:
→ Elimina gargalos
→ Multitarefa sem travamentos

Valor: R$ ${preco.toFixed(2)}

Suporte técnico para compatibilidade`,

    emailMarketing: `Assunto: ${nome} - Upgrade de Memória

Cliente,

A ${nome} oferece incremento imediato de performance.

INVESTIMENTO: R$ ${preco.toFixed(2)}

Verifica compatibilidade gratuitamente.

[Sua Loja]`,
  };
}

function gerarTextoPlacaMae(nome, preco, descricao, compat) {
  const socket = compat.socket || 'Socket compatível';
  const tipoRam = compat.tipoRam || 'DDR4/DDR5';

  return {
    instagramPost: `🖥️ MOTHERBOARD

${nome}

🔧 Compatibilidade:
• Socket: ${socket}
• RAM: ${tipoRam}
• PCIe moderno

💰 R$ ${preco.toFixed(2)}

#Motherboard #PCBuild`,

    whatsappStatus: `🖥️ ${nome}
${socket} | R$ ${preco.toFixed(2)}`,

    facebookPost: `[MOTHERBOARD] ${nome}

Compatibilidade:
→ Socket: ${socket}
→ Memória: ${tipoRam}

Valor: R$ ${preco.toFixed(2)}

Consultoria técnica: [contato]`,

    emailMarketing: `Assunto: ${nome} - Fundação do Seu Build

Cliente,

A motherboard ${nome} oferece plataforma robusta.

INVESTIMENTO: R$ ${preco.toFixed(2)}

[Sua Loja]`,
  };
}

function gerarTextoArmazenamento(nome, preco, descricao, compat) {
  return {
    instagramPost: `💿 ARMAZENAMENTO

${nome}

⚡ Tecnologia:
• SSD NVMe/SATA
• Boot ultra-rápido
• Transfer rápido

💰 R$ ${preco.toFixed(2)}

#SSD #Armazenamento`,

    whatsappStatus: `💿 ${nome}
R$ ${preco.toFixed(2)}
SSD de alta velocidade!`,

    facebookPost: `[ARMAZENAMENTO] ${nome}

Velocidade que faz diferença.

PERFORMANCE:
→ Leitura/Escrita otimizada
→ Ideal para SO e games

Valor: R$ ${preco.toFixed(2)}

Boot em segundos!`,

    emailMarketing: `Assunto: ${nome} - Performance em Armazenamento

Cliente,

O ${nome} eleva a responsividade do seu sistema.

INVESTIMENTO: R$ ${preco.toFixed(2)}

[Sua Loja]`,
  };
}

function gerarTextoFonte(nome, preco, descricao, compat) {
  return {
    instagramPost: `🔌 FONTE DE ALIMENTAÇÃO

${nome}

⚡ Confiabilidade:
• Certificação 80 Plus
• Proteções integradas
• Estável e segura

💰 R$ ${preco.toFixed(2)}

#Fonte #PSU`,

    whatsappStatus: `🔌 ${nome}
R$ ${preco.toFixed(2)}
Confiável e segura!`,

    facebookPost: `[FONTE DE ALIMENTAÇÃO] ${nome}

Segurança e estabilidade.

CARACTERÍSTICAS:
→ Potência adequada
→ Proteções elétricas

Valor: R$ ${preco.toFixed(2)}

A proteção do seu hardware!`,

    emailMarketing: `Assunto: ${nome} - Estabilidade e Segurança

Cliente,

A fonte ${nome} garante operação segura.

INVESTIMENTO: R$ ${preco.toFixed(2)}

[Sua Loja]`,
  };
}

function gerarTextoGabinete(nome, preco, descricao, compat) {
  return {
    instagramPost: `🏠 GABINETE

${nome}

🎨 Design:
• Estética moderna
• Ventilação otimizada
• Gerenciamento de cabos

💰 R$ ${preco.toFixed(2)}

#Gabinete #PCCase`,

    whatsappStatus: `🏠 ${nome}
R$ ${preco.toFixed(2)}
Design premium!`,

    facebookPost: `[GABINETE] ${nome}

A casa do seu hardware.

CARACTERÍSTICAS:
→ Formato compatível
→ Airflow otimizado

Valor: R$ ${preco.toFixed(2)}

Design e funcionalidade!`,

    emailMarketing: `Assunto: ${nome} - Estética e Funcionalidade

Cliente,

O gabinete ${nome} une design e performance.

INVESTIMENTO: R$ ${preco.toFixed(2)}

[Sua Loja]`,
  };
}

function gerarTextoGenerico(nome, preco, descricao, compat) {
  return {
    instagramPost: `🔧 COMPONENTE DISPONÍVEL

${nome}

✨ Características:
• Qualidade comprovada
• Compatibilidade ampla
• Performance garantida

💰 R$ ${preco.toFixed(2)}

#Hardware #PC`,

    whatsappStatus: `🔧 ${nome}
R$ ${preco.toFixed(2)}
De qualidade!`,

    facebookPost: `[COMPONENTE] ${nome}

${descricao || 'Componente de qualidade'}

Valor: R$ ${preco.toFixed(2)}

Atendimento especializado`,

    emailMarketing: `Assunto: ${nome} Disponível

Cliente,

O componente ${nome} está disponível.

INVESTIMENTO: R$ ${preco.toFixed(2)}

[Sua Loja]`,
  };
}
