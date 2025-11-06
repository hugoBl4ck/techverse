// api/parse-kit.js

// --- PROMPT DE ENGENHARIA (O Cérebro) ---
const systemPrompt = `Você é um assistente de TI especialista em hardware de computador. Sua função é extrair componentes de uma descrição de PC para um formato JSON.

Analise o texto abaixo e retorne um objeto JSON que contenha:
1.  Um campo "precoTotal" (number), se o preço for encontrado.
2.  Um array "componentes". Cada objeto no array deve ter:
    - "nome": O nome da peça (ex: "Intel Core i5 4ª Geração").
    - "tipo": A categoria da peça (use UMA das seguintes: 'cpu', 'placa-mae', 'ram', 'gpu', 'armazenamento', 'fonte', 'gabinete', 'outro').

NÃO inclua emojis. Retorne APENAS o JSON.`;

// --- FUNÇÃO PRINCIPAL (O ROTEADOR) ---
export default async function handler(request, response) {
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Método não permitido' });
  }

  // Adicionado para garantir que o corpo seja JSON
  let body = request.body;
  try {
    if (typeof body === 'string') {
      body = JSON.parse(body);
    }
  } catch (error) {
    console.error("Erro ao fazer parse do corpo da requisição:", request.body);
    return response.status(400).json({ error: 'Corpo da requisição mal formatado.' });
  }

  const { texto } = body || {};
  if (!texto) {
    console.error("Nenhum texto encontrado no corpo da requisição. Corpo processado:", body);
    return response.status(400).json({ error: 'Nenhum texto fornecido' });
  }

  const PPLX_KEY = process.env.PERPLEXITY_API_KEY;
  const GEMINI_KEY = process.env.GEMINI_API_KEY;

  // --- TENTATIVA 1: PERPLEXITY (O RÁPIDO) ---
  if (PPLX_KEY) {
    try {
      console.log('Tentando API: Perplexity...');
      const jsonResult = await callPerplexity(texto, PPLX_KEY);
      return response.status(200).json(jsonResult);
    } catch (perplexityError) {
      
      // ===== ESTE É O LOG DETALHADO QUE VOCÊ PEDIU =====
      console.error(
        "FALHA NO PERPLEXITY. Motivo:", 
        perplexityError.message
      );
      // =================================================

      // Não retorne o erro ainda, vamos tentar o Gemini
      console.log('Perplexity falhou. Tentando fallback: Gemini...');
    }
  }

  // --- TENTATIVA 2: GEMINI (O FALLBACK) ---
  if (GEMINI_KEY) {
    try {
      console.log('Tentando API: Gemini...');
      const jsonResult = await callGemini(texto, GEMINI_KEY);
      return response.status(200).json(jsonResult);
    } catch (geminiError) {
      console.error("FALHA NO GEMINI. Motivo:", geminiError.message);
      return response.status(500).json({ error: 'Falha no Gemini', details: geminiError.message });
    }
  }

  // Se nenhuma chave estiver configurada
  return response.status(500).json({ error: 'Nenhuma chave de API de IA configurada no servidor.' });
}


// --- HELPER 1: CHAMADA DO PERPLEXITY ---
async function callPerplexity(texto, apiKey) {
  const response = await fetch('https://api.perplexity.ai/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'sonar-small-online',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: texto }
      ],
      response_format: { type: 'json_object' } // Vamos tentar com o 'json_object' de novo
    })
  });

  if (!response.ok) {
    const errorDetails = await response.text();
    // Envia o erro exato do Perplexity para o log do servidor
    throw new Error(`Erro ${response.status} do Perplexity: ${errorDetails}`);
  }

  const data = await response.json();
  return JSON.parse(data.choices[0].message.content);
}

// --- HELPER 2: CHAMADA DO GEMINI ---
async function callGemini(texto, apiKey) {
  // A API do Gemini usa uma URL e um formato de 'body' diferentes
  const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${apiKey}`;

  // O prompt do Gemini funciona melhor se pedirmos explicitamente o JSON
  const geminiPrompt = `${systemPrompt}\n\nTexto para analisar:\n${texto}`;

  const response = await fetch(GEMINI_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      contents: [{
        parts: [{ text: geminiPrompt }]
      }],
      generationConfig: {
        // Força a resposta a ser JSON
        responseMimeType: "application/json", 
      }
    })
  });

  if (!response.ok) {
    const errorDetails = await response.text();
    throw new Error(`Erro ${response.status} do Gemini: ${errorDetails}`);
  }

  const data = await response.json();
  // O Gemini retorna o JSON de forma diferente
  const jsonString = data.candidates[0].content.parts[0].text;
  return JSON.parse(jsonString);
}