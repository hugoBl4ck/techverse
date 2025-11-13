/**
 * Endpoint de teste para validar chamadas à API do AliExpress
 * POST /api/test-aliexpress
 * Body: { "productId": "1005009384380972" }
 */

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  try {
    const { productId, url } = req.body

    if (!productId && !url) {
      return res.status(400).json({ error: 'Forneça productId ou url' })
    }

    let idProduto = productId

    // Se forneceu URL, extrair o ID
    if (url && !productId) {
      idProduto = extrairProductIdDoUrl(url)
      if (!idProduto) {
        return res.status(400).json({ error: 'Não consegui extrair ID do produto da URL' })
      }
    }

    const ALIEX_API_KEY = process.env.ALIEXPRESS_API_KEY

    if (!ALIEX_API_KEY) {
      return res.status(400).json({ 
        error: 'ALIEXPRESS_API_KEY não configurada',
        hint: 'Configure as variáveis de ambiente ALIEXPRESS_API_KEY e opcionalmente ALIEXPRESS_SECRET'
      })
    }

    console.log('Testando produto ID:', idProduto)

    // Chamar a API do AliExpress
    const resultado = await testarAPIAliExpress(idProduto, ALIEX_API_KEY)

    return res.status(200).json({
      produtoId: idProduto,
      resultado: resultado,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Erro no teste:', error)
    res.status(500).json({ 
      error: 'Erro ao testar API',
      message: error.message
    })
  }
}

async function testarAPIAliExpress(productId, apiKey) {
  try {
    const crypto = require('crypto')

    const appKey = apiKey
    const appSecret = process.env.ALIEXPRESS_SECRET || apiKey

    const timestamp = Date.now().toString()

    const params = {
      app_key: appKey,
      method: 'aliexpress.affiliate.productdetail.get',
      sign_method: 'md5',
      timestamp: timestamp,
      format: 'json',
      v: '2.0',
      product_ids: productId,
      target_currency: 'USD',
      target_language: 'EN'
    }

    // Construir string para assinar
    const sortedKeys = Object.keys(params).sort()
    let signStr = appSecret
    
    sortedKeys.forEach(key => {
      signStr += key + params[key]
    })
    
    signStr += appSecret

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

    console.log('URL:', apiUrl.substring(0, 150) + '...')
    console.log('Parâmetros:', params)

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    })

    const data = await response.json()

    console.log('Status:', response.status)
    console.log('Resposta completa:', JSON.stringify(data, null, 2))

    return {
      statusCode: response.status,
      statusText: response.statusText,
      responseBody: data,
      hasError: !!data.error_response,
      errorDetails: data.error_response || null,
      productFound: !!(data.resp_result?.result?.products?.length > 0 || data.result?.products?.length > 0),
      productsCount: data.resp_result?.result?.products?.length || data.result?.products?.length || 0
    }

  } catch (error) {
    console.error('Erro ao testar API:', error)
    return {
      error: true,
      message: error.message,
      stack: error.stack
    }
  }
}

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
    
    return null
  } catch (error) {
    console.error('Erro ao extrair ID:', error.message)
    return null
  }
}
