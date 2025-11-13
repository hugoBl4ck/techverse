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

    // Tentar buscar dados reais do produto se houver link
    let dadosProduto = {
      titulo: productName || null,
      descricao: null,
      precoOriginal: originalPrice,
      precoAtual: productPrice
    }

    if (productLink) {
      try {
        console.log('Buscando dados reais do produto...')
        const dadosExtraidos = await extrairDadosProduto(productLink)
        if (dadosExtraidos) {
          dadosProduto = { ...dadosProduto, ...dadosExtraidos }
          console.log('Dados do produto extraídos:', dadosProduto)
        }
      } catch (e) {
        console.error('Erro ao extrair dados:', e.message)
        // Continua com dados parciais
      }
    }

    // Preparar dados para análise com informações reais
     const prompt = `Você é um especialista em marketing e e-commerce de produtos de tecnologia.

    Analise o seguinte produto REAL e gere uma promoção profissional baseada em DADOS REAIS:

    ${dadosProduto.titulo ? `Produto: ${dadosProduto.titulo}` : ''}
    ${dadosProduto.descricao ? `Descrição Original: ${dadosProduto.descricao}` : ''}
    ${dadosProduto.precoAtual ? `Preço Atual: BRL ${dadosProduto.precoAtual}` : ''}
    ${dadosProduto.precoOriginal ? `Preço Original: BRL ${dadosProduto.precoOriginal}` : ''}
    ${productLink ? `Link: ${productLink}` : ''}

    Use as informações REAIS do produto acima para gerar uma promoção precisa e atrativa.
    Destaque as características técnicas e benefícios reais mencionados.

    Gere um JSON com a seguinte estrutura:
    {
    "titulo": "Título atrativo baseado no produto real (máx 60 caracteres)",
    "descricao": "Descrição com especificações técnicas REAIS do produto (máx 200 caracteres)",
    "desconto": ${originalPrice && productPrice ? Math.round(((originalPrice - productPrice) / originalPrice) * 100) : 25},
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
        // Primeiro tenta usar imagens extraídas do scraping
        if (dadosProduto.imagens && dadosProduto.imagens.length > 0) {
          fotos = dadosProduto.imagens.slice(0, 3) // Pega até 3 imagens
          console.log(`Usando ${fotos.length} imagens do scraping do produto`)
        } else {
          // Se não tiver imagens do scraping, tenta buscar outras
          fotos = await buscarImagensDoLink(productLink)
        }
      } catch (error) {
        console.error('Erro ao buscar imagens:', error.message)
      }
    }

    // Validar e processar o link
    const linkProcessado = await validarEProcessarLink(productLink)
    
    console.log('=== RESULTADO FINAL ===')
    console.log('Link Original:', productLink)
    console.log('Link Processado:', linkProcessado)
    console.log('Será Salvo:', linkProcessado)
    console.log('===================')

    return res.status(200).json({
      promocao: {
        titulo: promocaoData.titulo,
        descricao: promocaoData.descricao,
        desconto: promocaoData.desconto,
        linkCompra: linkProcessado,
        fotos: fotos,
        categoria: promocaoData.categoriaTagsRelevantes || []
      },
      fotos: fotos,
      debug: {
        linkOriginal: productLink,
        linkProcessado: linkProcessado
      }
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
 * Valida e processa links, especialmente AliExpress
 * Resolve redirecionamentos e normaliza URLs usando API do AliExpress
 */
async function validarEProcessarLink(url) {
  if (!url) return ''

  try {
    // Validar URL básica
    const urlObj = new URL(url)
    
    // Se for AliExpress, processar com API
    if (url.includes('aliexpress') || url.includes('s.click.aliexpress')) {
      return await processarLinkAliExpressAPI(url)
    }

    // Para outros links, retornar validado
    return urlObj.href
  } catch (error) {
    console.error('Erro ao validar link:', error.message)
    // Se der erro na validação, retornar o original
    return url || ''
  }
}

/**
 * Processa links do AliExpress extraindo IDs de produtos
 * Segue redirects e reconstrói com affiliate tracking
 */
async function processarLinkAliExpressAPI(url) {
  try {
    let finalUrl = url
    
    // Se for link de redirecionamento curto, resolver primeiro
    // Usamos GET pois HEAD pode não funcionar corretamente para redirects no AliExpress.
    if (url.includes('s.click.aliexpress')) {
      try {
        const response = await fetch(url, {
          method: 'GET',
          redirect: 'follow',
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
          }
        })
        finalUrl = response.url
      } catch (error) {
        console.error('Erro ao resolver redirect do AliExpress com GET:', error.message)
        return url // Retornar original se não conseguir resolver
      }
    }

    // Extrair product ID do URL final
    const productId = extrairProductIdDoUrl(finalUrl)
    
    if (!productId) {
      console.warn('Não foi possível extrair ID do produto:', finalUrl)
      return finalUrl
    }

    // Tentar usar API do AliExpress para validar e gerar link correto
    const linkValidado = await validarProductoComAPI(productId, finalUrl)
    return linkValidado || finalUrl
    
  } catch (error) {
    console.error('Erro ao processar link AliExpress:', error.message)
    // Em caso de erro, retornar URL original
    return url
  }
}

/**
 * Extrai o ID do produto de uma URL do AliExpress
 * Trata diferentes formatos de URL (item/, item_id=, etc)
 */
function extrairProductIdDoUrl(url) {
  try {
    const urlObj = new URL(url)
    
    // Formato 1: /item/12345678901.html
    const match1 = urlObj.pathname.match(/\/item\/(\d+)/)
    if (match1) return match1[1]
    
    // Formato 2: ?item_id=12345678901
    const itemId = urlObj.searchParams.get('item_id')
    if (itemId) return itemId
    
    // Formato 3: /wholesale-item/12345678901.html
    const match2 = urlObj.pathname.match(/\/wholesale-item\/(\d+)/)
    if (match2) return match2[1]
    
    // Formato 4: /w/wholesale-12345678901.html
    const match3 = urlObj.pathname.match(/\/w\/wholesale-(\d+)/)
    if (match3) return match3[1]
    
    return null
  } catch (error) {
    console.error('Erro ao extrair ID:', error.message)
    return null
  }
}

/**
 * Valida o produto usando a API do AliExpress
 * Faz uma chamada à API para validar que o produto existe
 */
async function validarProductoComAPI(productId, originalUrl) {
  try {
    const ALIEX_API_KEY = process.env.ALIEXPRESS_API_KEY
    
    // Se não temos credenciais, apenas normalizar URL
    if (!ALIEX_API_KEY) {
      console.log('ALIEXPRESS_API_KEY não configurada, usando URL normalizado')
      return normalizarUrlAliExpress(originalUrl)
    }

    // Chamar API do AliExpress para validar o produto
    const produtoValido = await chamarAPIAliExpress(productId, ALIEX_API_KEY)
    
    if (produtoValido) {
      console.log(`Produto ${productId} validado com sucesso na API do AliExpress`)
      return normalizarUrlAliExpress(originalUrl)
    } else {
      console.warn(`Produto ${productId} não encontrado na API do AliExpress`)
      return normalizarUrlAliExpress(originalUrl)
    }
    
  } catch (error) {
    console.error('Erro na validação com API:', error.message)
    // Em caso de erro na API, continuar com URL normalizado
    return normalizarUrlAliExpress(originalUrl)
  }
}

/**
 * Chama a API do AliExpress para validar e obter detalhes do produto
 * Endpoint: aliexpress.affiliate.productdetail.get
 */
async function chamarAPIAliExpress(productId, apiKey) {
  try {
    const crypto = require('crypto')
    
    // Parâmetros da requisição
    const timestamp = new Date().toISOString().replace(/[-:.Z]/g, '').substring(0, 14)
    
    const params = {
      app_key: apiKey,
      method: 'aliexpress.affiliate.productdetail.get',
      sign_method: 'md5',
      timestamp: timestamp,
      format: 'json',
      v: '2.0',
      product_ids: productId,
      target_currency: 'USD',
      target_language: 'EN'
    }

    // Gerar assinatura MD5
    const sortedParams = Object.keys(params).sort().reduce((acc, key) => {
      acc[key] = params[key]
      return acc
    }, {})

    // Construir string para assinar: key1value1key2value2...
    let signStr = ''
    Object.entries(sortedParams).forEach(([key, value]) => {
      signStr += key + value
    })

    // Adicionar secret (que é o apiKey novamente)
    signStr = apiKey + signStr + apiKey
    
    // Gerar MD5
    const sign = crypto
      .createHash('md5')
      .update(signStr, 'utf8')
      .digest('hex')
      .toUpperCase()

    // Montar URL da requisição
    const queryParams = new URLSearchParams({
      ...params,
      sign: sign
    })

    const apiUrl = `https://gw.api.taobao.com/router/rest?${queryParams.toString()}`

    console.log('Chamando API do AliExpress:', {
      product_id: productId,
      timestamp: timestamp
    })

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 5000 // timeout de 5 segundos
    })

    if (!response.ok) {
      console.error(`Erro na API: ${response.status} ${response.statusText}`)
      return false
    }

    const data = await response.json()

    // Verificar se a resposta contém erros
    if (data.error_response) {
      console.error('Erro da API AliExpress:', data.error_response)
      return false
    }

    // Verificar se conseguimos os detalhes do produto
    if (data.resp_result && data.resp_result.result) {
      const products = data.resp_result.result.products || []
      if (products.length > 0 && products[0].product_id) {
        console.log('Produto encontrado:', products[0].product_title || products[0].product_id)
        return true
      }
    }

    console.warn('Nenhum produto encontrado na resposta')
    return false

  } catch (error) {
    console.error('Erro ao chamar API do AliExpress:', error.message)
    return false
  }
}

/**
 * Normaliza a URL do AliExpress
 * Remove parâmetros desnecessários e mantém estrutura limpa
 */
function normalizarUrlAliExpress(url) {
  try {
    const urlObj = new URL(url)
    
    // Preservar parâmetros importantes para affiliate tracking
    const paramsPreservados = [
      'item_id',
      'sku_id',
      'affiliate_id',
      'aff_fcid',
      'aff_fsk',
      'aff_fscid',
      'aff_source',
      'scm',
      'pdp_ext_f',
      'pdp_newnui',
      'src',
      'pvid'
    ]
    
    const novasParams = new URLSearchParams()
    
    paramsPreservados.forEach(param => {
      const valor = urlObj.searchParams.get(param)
      if (valor) {
        novasParams.set(param, valor)
      }
    })

    // Reconstruir URL com protocolo HTTPS e parâmetros limpos
    const queryString = novasParams.toString()
    const urlNormalizada = `https://${urlObj.hostname}${urlObj.pathname}${queryString ? '?' + queryString : ''}`
    
    console.log('URL normalizada:', urlNormalizada)
    return urlNormalizada
    
  } catch (error) {
    console.error('Erro ao normalizar URL:', error.message)
    return url
  }
}

/**
 * Extrai dados reais do produto do HTML da página
 * Busca título, descrição e imagens
 */
async function extrairDadosProduto(url) {
  try {
    console.log('Tentando fazer scraping do produto:', url)

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      },
      timeout: 10000
    })

    if (!response.ok) {
      console.warn(`Erro ao buscar página: ${response.status}`)
      return null
    }

    const html = await response.text()

    // Extrair titulo do produto (procura em múltiplos lugares)
    let titulo = null
    
    // AliExpress usa h1 com class específica para título
    const tituloMatch = html.match(/<h1[^>]*>([^<]+)<\/h1>/)
    if (tituloMatch) titulo = tituloMatch[1].trim()
    
    // Alternativa: procurar em atributos JSON do site
    if (!titulo) {
      const jsonMatch = html.match(/"productTitle":"([^"]+)"/)
      if (jsonMatch) titulo = jsonMatch[1]
    }

    // Alternativa: procurar em meta tags
    if (!titulo) {
      const metaMatch = html.match(/<meta[^>]*property="og:title"[^>]*content="([^"]+)"/)
      if (metaMatch) titulo = metaMatch[1]
    }

    // Extrair descrição
    let descricao = null
    const descMatch = html.match(/<meta[^>]*name="description"[^>]*content="([^"]+)"/)
    if (descMatch) descricao = descMatch[1]

    // Extrair imagens (procura por multiple imagens)
    let imagens = []
    
    // AliExpress geralmente tem imgs em um div específico
    const imgMatches = html.matchAll(/<img[^>]*src="([^"]*?alicdn[^"]*)"[^>]*>/g)
    for (const match of imgMatches) {
      if (match[1] && !match[1].includes('logo')) {
        imagens.push(match[1])
      }
      if (imagens.length >= 5) break
    }

    // Se não achou imagens, procura por data-src (lazy loading)
    if (imagens.length === 0) {
      const lazyMatches = html.matchAll(/<img[^>]*data-src="([^"]*?alicdn[^"]*)"[^>]*>/g)
      for (const match of lazyMatches) {
        if (match[1]) {
          imagens.push(match[1])
        }
        if (imagens.length >= 5) break
      }
    }

    console.log('Dados extraídos:', { titulo, descricao, imagens: imagens.length })

    return {
      titulo: titulo || null,
      descricao: descricao || null,
      imagens: imagens
    }

  } catch (error) {
    console.error('Erro ao extrair dados do produto:', error.message)
    return null
  }
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
