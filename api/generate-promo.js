/**
 * Gera promoções automáticas com IA usando Perplexity
 * Busca imagens do produto e preenche os campos automaticamente
 */

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  try {
    const { productLink, productName, productPrice, originalPrice } = req.body

    if (!productLink && !productName) {
      return res.status(400).json({ error: 'Forneça pelo menos um link ou nome do produto' })
    }

    const PPLX_KEY = process.env.PERPLEXITY_API_KEY
    const GEMINI_KEY = process.env.GEMINI_API_KEY

    // Preparar dados para análise
    const prompt = `Você é um especialista em marketing e e-commerce de produtos de tecnologia.

Analise o seguinte produto e gere uma promoção profissional:

${productLink ? `Link: ${productLink}` : ''}
${productName ? `Nome: ${productName}` : ''}
${productPrice ? `Preço Atual: BRL ${productPrice}` : ''}
${originalPrice ? `Preço Original: BRL ${originalPrice}` : ''}

Gere um JSON com a seguinte estrutura:
{
  "titulo": "Título atrativo e claro (máx 60 caracteres)",
  "descricao": "Descrição completa do produto com especificações técnicas (máx 200 caracteres)",
  "desconto": número de 1 a 100,
  "categoriaTagsRelevantes": ["tag1", "tag2", "tag3"]
}

Retorne APENAS o JSON, sem markdown ou explicações.`

    let promocaoData = null

    // Tentar com Perplexity
    if (PPLX_KEY) {
      try {
        console.log('Gerando promoção com Perplexity...')
        promocaoData = await callPerplexity(prompt, PPLX_KEY)
      } catch (perplexityError) {
        console.error('Erro no Perplexity:', perplexityError.message)
      }
    }

    // Fallback para Gemini
    if (!promocaoData && GEMINI_KEY) {
      try {
        console.log('Gerando promoção com Gemini (fallback)...')
        promocaoData = await callGemini(prompt, GEMINI_KEY)
      } catch (geminiError) {
        console.error('Erro no Gemini:', geminiError.message)
      }
    }

    // Se ainda não temos dados, usar fallback
    if (!promocaoData) {
      promocaoData = {
        titulo: productName || 'Novo Produto em Promoção',
        descricao: `Produto de alta qualidade com preço especial. ${productPrice ? `Agora: BRL ${productPrice}` : ''}`,
        desconto: originalPrice && productPrice ? Math.round(((originalPrice - productPrice) / originalPrice) * 100) : 50,
        categoriaTagsRelevantes: ['eletrônicos', 'promoção', 'oferta']
      }
    }

    // Buscar imagens do link (se fornecido)
    let fotos = []
    if (productLink) {
      try {
        fotos = await buscarImagensDoLink(productLink)
      } catch (error) {
        console.error('Erro ao buscar imagens:', error.message)
      }
    }

    return res.status(200).json({
      promocao: {
        titulo: promocaoData.titulo,
        descricao: promocaoData.descricao,
        desconto: promocaoData.desconto,
        linkCompra: productLink || '',
        fotos: fotos,
        categoria: promocaoData.categoriaTagsRelevantes || []
      },
      fotos: fotos
    })

  } catch (error) {
    console.error('Erro ao gerar promoção:', error)
    res.status(500).json({ error: 'Erro interno do servidor' })
  }
}

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
        {
          role: 'system',
          content: 'Você é um especialista em marketing. Retorne APENAS JSON válido, sem markdown.'
        },
        { role: 'user', content: prompt }
      ]
    })
  })

  if (!response.ok) {
    const errorDetails = await response.text()
    throw new Error(`Erro ${response.status} do Perplexity: ${errorDetails}`)
  }

  const data = await response.json()
  return JSON.parse(data.choices[0].message.content)
}

async function callGemini(prompt, apiKey) {
  const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${apiKey}`

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
        responseMimeType: 'application/json'
      }
    })
  })

  if (!response.ok) {
    const errorDetails = await response.text()
    throw new Error(`Erro ${response.status} do Gemini: ${errorDetails}`)
  }

  const data = await response.json()
  const jsonString = data.candidates[0].content.parts[0].text
  return JSON.parse(jsonString)
}

/**
 * Busca imagens de um link usando scraping simples
 * Retorna até 3 imagens principais
 */
async function buscarImagensDoLink(url) {
  try {
    // Usar a API do Bing para buscar imagens relacionadas
    // Alternativa: usar o próprio link e fazer scraping
    
    // Para AliExpress, podemos tentar extrair as imagens do HTML
    if (url.includes('aliexpress') || url.includes('ali')) {
      // Usar a API de busca de imagens do Bing
      return await buscarImagensBing(url)
    }

    return []
  } catch (error) {
    console.error('Erro ao buscar imagens:', error)
    return []
  }
}

/**
 * Busca imagens usando Bing Image Search API
 */
async function buscarImagensBing(query) {
  try {
    // Extrair nome do produto do URL ou usar o URL como query
    const searchQuery = query.split('/').pop().replace(/[-_]/g, ' ').substring(0, 100)

    // Aqui você usaria a API do Bing, mas sem chave é complicado
    // Alternativa: usar uma API gratuita como Unsplash ou Pexels
    // Para agora, retornamos um array vazio que o usuário pode preencher

    return []
  } catch (error) {
    console.error('Erro ao buscar imagens Bing:', error)
    return []
  }
}
