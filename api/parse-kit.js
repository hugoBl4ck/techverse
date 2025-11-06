// api/parse-kit.js

/**
 * Esta é a nossa API Serverless (Backend).
 * Ela recebe o texto do Vue, chama o Perplexity, e devolve o JSON.
 */
export default async function handler(request, response) {
  // 1. Só aceitar método POST (do nosso formulário)
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Método não permitido' });
  }

  // 2. Ler a chave da API (que você colocou no Vercel)
  const PERPLEXITY_API_KEY = process.env.PERPLEXITY_API_KEY;

  if (!PERPLEXITY_API_KEY) {
    console.error('Chave PERPLEXITY_API_KEY não encontrada');
    return response.status(500).json({ error: 'Chave da API não configurada no servidor' });
  }

  // 3. Pegar o texto que o Vue enviou
  const { text } = request.body;

  if (!text) {
    return response.status(400).json({ error: 'Nenhum texto fornecido' });
  }

  // 4. O Prompt de Engenharia (O Cérebro da IA)
  const systemPrompt = `Você é um assistente de TI especialista em hardware de computador. Sua função é extrair componentes de uma descrição de PC para um formato JSON.

Analise o texto abaixo e retorne um objeto JSON que contenha:
1.  Um campo "precoTotal" (number), se o preço for encontrado.
2.  Um array "componentes". Cada objeto no array deve ter:
    - "nome": O nome da peça (ex: "Intel Core i5 4ª Geração").
    - "tipo": A categoria da peça (use UMA das seguintes: 'cpu', 'placa-mae', 'ram', 'gpu', 'armazenamento', 'fonte', 'gabinete', 'outro').

NÃO inclua emojis. Retorne APENAS o JSON.`;

  // 5. Chamar a API do Perplexity
  try {
    const apiResponse = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${PERPLEXITY_API_KEY}`
      },
      body: JSON.stringify({
        model: 'sonar',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: text } // O texto do seu anúncio
        ],
        response_format: { type: 'json_object' } // Força a resposta a ser JSON
      })
    });

    if (!apiResponse.ok) {
      const errorData = await apiResponse.text();
      console.error('Erro da API Perplexity:', errorData);
      return response.status(apiResponse.status).json({ error: 'Erro da API Perplexity', details: errorData });
    }

    const data = await apiResponse.json();
    
    // 6. Extrair e enviar a resposta JSON de volta para o Vue
    const jsonResponse = JSON.parse(data.choices[0].message.content);
    
    return response.status(200).json(jsonResponse);

  } catch (error) {
    console.error('Erro interno do servidor:', error);
    return response.status(500).json({ error: 'Erro interno do servidor', details: error.message });
  }
}