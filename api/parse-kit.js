// api/parse-kit.js

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Método não permitido' });
  }

  const PERPLEXITY_API_KEY = process.env.PERPLEXITY_API_KEY;

  if (!PERPLEXITY_API_KEY) {
    console.error('Chave PERPLEXITY_API_KEY não encontrada');
    return response.status(500).json({ error: 'Chave da API não configurada no servidor' });
  }

  const { texto } = request.body;
  if (!texto) {
    return response.status(400).json({ error: 'Nenhum texto fornecido' });
  }

  const systemPrompt = `Você é um assistente de TI especialista em hardware de computador. Sua função é extrair componentes de uma descrição de PC para um formato JSON.

Analise o texto abaixo e retorne um objeto JSON que contenha:
1.  Um campo "precoTotal" (number), se o preço for encontrado.
2.  Um array "componentes". Cada objeto no array deve ter:
    - "componente": O nome da peça (ex: "Intel Core i5 4ª Geração").
    - "tipo": A categoria da peça (use UMA das seguintes: 'cpu', 'placa-mae', 'ram', 'gpu', 'armazenamento', 'fonte', 'gabinete', 'outro').

NÃO inclua emojis. Retorne APENAS o JSON.`;

  try {
    const apiResponse = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${PERPLEXITY_API_KEY}`
      },
      body: JSON.stringify({
        model: 'sonar-small-online', // Modelo correto que você lembrou
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: texto }
        ]
        
        // --- A LINHA 'response_format' FOI REMOVIDA DAQUI ---

      })
    });

    if (!apiResponse.ok) {
      const errorData = await apiResponse.text();
      console.error('Erro da API Perplexity:', errorData);
      return response.status(apiResponse.status).json({ error: 'Erro da API Perplexity', details: errorData });
    }

    const data = await apiResponse.json();
    
    // Agora temos que PARSEAR a resposta, pois ela não é mais JSON garantido
    // (Embora o prompt peça)
    const jsonString = data.choices[0].message.content;
    const jsonResponse = JSON.parse(jsonString);
    
    return response.status(200).json(jsonResponse);

  } catch (error) {
    console.error('Erro interno do servidor:', error);
    // Este 'catch' pode pegar o 'JSON.parse' se a IA não retornar um JSON
    return response.status(500).json({ error: 'Erro ao processar a resposta da IA', details: error.message });
  }
}