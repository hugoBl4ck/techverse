/**
 * API de debug para verificar o processamento de links e promoções
 * Retorna informações detalhadas sobre o que está acontecendo
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

    const debugInfo = {
      input: {
        productLink,
        productName,
        productPrice,
        originalPrice
      },
      processamento: [],
      links: {
        original: productLink,
        processado: null
      },
      promocao: null,
      erros: []
    }

    try {
      // Passo 1: Extrair product ID
      debugInfo.processamento.push('✓ Iniciando processamento de link')

      const productId = extrairProductIdDoUrl(productLink)
      debugInfo.processamento.push(`ID do produto extraído: ${productId || 'NÃO ENCONTRADO'}`)

      if (!productId) {
        debugInfo.erros.push('Não foi possível extrair o ID do produto do link fornecido')
      }

      // Passo 2: Resolver redirects
      if (productLink.includes('s.click.aliexpress')) {
        debugInfo.processamento.push('Detectado link de redirect - tentando resolver...')
        try {
          const resolvedUrl = await resolverRedirect(productLink)
          debugInfo.links.original_resolved = resolvedUrl
          debugInfo.processamento.push(`Link resolvido: ${resolvedUrl}`)
        } catch (e) {
          debugInfo.erros.push(`Erro ao resolver redirect: ${e.message}`)
        }
      }

      // Passo 3: Normalizar URL
      const normalizado = normalizarUrlAliExpress(productLink)
      debugInfo.links.processado = normalizado
      debugInfo.processamento.push(`Link normalizado: ${normalizado}`)

      // Passo 4: Chamar API do AliExpress
      const ALIEX_API_KEY = process.env.ALIEXPRESS_API_KEY
      if (ALIEX_API_KEY && productId) {
        debugInfo.processamento.push('Validando na API do AliExpress...')
        const apiResult = await chamarAPIAliExpressDebug(productId, ALIEX_API_KEY)
        debugInfo.processamento.push(`Resultado da API: ${apiResult.success ? 'SUCESSO' : 'FALHA'}`)
        if (apiResult.details) {
          debugInfo.api = apiResult.details
        }
      } else {
        debugInfo.processamento.push('⚠ ALIEXPRESS_API_KEY não configurada')
      }

      // Passo 5: Gerar promoção
      debugInfo.processamento.push('Gerando dados de promoção...')

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

      const PPLX_KEY = process.env.PERPLEXITY_API_KEY
      const GEMINI_KEY = process.env.GEMINI_API_KEY

      let promocaoData = null

      if (PPLX_KEY) {
        try {
          debugInfo.processamento.push('Tentando gerar com Perplexity...')
          const response = await fetch('https://api.perplexity.ai/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${PPLX_KEY}`
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

          if (response.ok) {
            const data = await response.json()
            promocaoData = JSON.parse(data.choices[0].message.content)
            debugInfo.processamento.push('✓ Promoção gerada com Perplexity')
          } else {
            const errorText = await response.text()
            debugInfo.erros.push(`Erro Perplexity: ${response.status} - ${errorText}`)
          }
        } catch (e) {
          debugInfo.erros.push(`Erro ao chamar Perplexity: ${e.message}`)
        }
      }

      if (!promocaoData && GEMINI_KEY) {
        try {
          debugInfo.processamento.push('Tentando gerar com Gemini...')
          const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-pro-preview:generateContent?key=${GEMINI_KEY}`

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

          if (response.ok) {
            const data = await response.json()
            const jsonString = data.candidates[0].content.parts[0].text
            promocaoData = JSON.parse(jsonString)
            debugInfo.processamento.push('✓ Promoção gerada com Gemini')
          } else {
            const errorText = await response.text()
            debugInfo.erros.push(`Erro Gemini: ${response.status} - ${errorText}`)
          }
        } catch (e) {
          debugInfo.erros.push(`Erro ao chamar Gemini: ${e.message}`)
        }
      }

      if (!promocaoData) {
        debugInfo.erros.push('Nenhuma API disponível ou ambas falharam')
        promocaoData = {
          titulo: productName || 'Novo Produto em Promoção',
          descricao: `Produto de alta qualidade com preço especial. ${productPrice ? `Agora: BRL ${productPrice}` : ''}`,
          desconto: originalPrice && productPrice ? Math.round(((originalPrice - productPrice) / originalPrice) * 100) : 50,
          categoriaTagsRelevantes: ['eletrônicos', 'promoção', 'oferta']
        }
        debugInfo.processamento.push('⚠ Usando fallback para dados de promoção')
      }

      debugInfo.promocao = {
        titulo: promocaoData.titulo,
        descricao: promocaoData.descricao,
        desconto: promocaoData.desconto,
        linkCompra: normalizado,
        categoria: promocaoData.categoriaTagsRelevantes || []
      }

      debugInfo.processamento.push('✓ Promoção pronta para salvar')
      debugInfo.processamento.push(`LINK QUE SERÁ SALVO: ${normalizado}`)

      return res.status(200).json({
        sucesso: debugInfo.erros.length === 0,
        debug: debugInfo
      })

    } catch (error) {
      debugInfo.erros.push(`Erro geral: ${error.message}`)
      return res.status(200).json({
        sucesso: false,
        debug: debugInfo
      })
    }

  } catch (error) {
    console.error('Erro no debug:', error)
    res.status(500).json({ error: 'Erro interno do servidor' })
  }
}

function extrairProductIdDoUrl(url) {
  try {
    const urlObj = new URL(url)

    const match1 = urlObj.pathname.match(/\/item\/(\d+)/)
    if (match1) return match1[1]

    const itemId = urlObj.searchParams.get('item_id')
    if (itemId) return itemId

    const match2 = urlObj.pathname.match(/\/wholesale-item\/(\d+)/)
    if (match2) return match2[1]

    const match3 = urlObj.pathname.match(/\/w\/wholesale-(\d+)/)
    if (match3) return match3[1]

    return null
  } catch (error) {
    console.error('Erro ao extrair ID:', error.message)
    return null
  }
}

async function resolverRedirect(url) {
  const response = await fetch(url, {
    method: 'HEAD',
    redirect: 'follow',
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
  })
  return response.url
}

function normalizarUrlAliExpress(url) {
  try {
    const urlObj = new URL(url)

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

    const queryString = novasParams.toString()
    const urlNormalizada = `https://${urlObj.hostname}${urlObj.pathname}${queryString ? '?' + queryString : ''}`

    return urlNormalizada
  } catch (error) {
    console.error('Erro ao normalizar URL:', error.message)
    return url
  }
}

async function chamarAPIAliExpressDebug(productId, apiKey) {
  try {
    const crypto = require('crypto')

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

    const sortedParams = Object.keys(params).sort().reduce((acc, key) => {
      acc[key] = params[key]
      return acc
    }, {})

    let signStr = ''
    Object.entries(sortedParams).forEach(([key, value]) => {
      signStr += key + value
    })

    signStr = apiKey + signStr + apiKey

    const sign = crypto
      .createHash('md5')
      .update(signStr, 'utf8')
      .digest('hex')
      .toUpperCase()

    const queryParams = new URLSearchParams({
      ...params,
      sign: sign
    })

    const apiUrl = `https://gw.api.taobao.com/router/rest?${queryParams.toString()}`

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0'
      }
    })

    const data = await response.json()

    if (data.error_response) {
      return {
        success: false,
        details: data.error_response
      }
    }

    if (data.resp_result && data.resp_result.result && data.resp_result.result.products) {
      const products = data.resp_result.result.products
      return {
        success: products.length > 0,
        details: products[0] || data.resp_result.result
      }
    }

    return {
      success: false,
      details: data
    }
  } catch (error) {
    return {
      success: false,
      details: { error: error.message }
    }
  }
}
