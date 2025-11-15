/**
 * API endpoint para extrair dados de produtos AliExpress
 * POST /api/aliexpress-product
 * Body: { "url": "https://pt.aliexpress.com/item/1005006997378224.html", "affiliateUrl": "https://s.click.aliexpress.com/e/_xxxxx" }
 */

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  try {
    const { url, affiliateUrl } = req.body

    if (!url) {
      return res.status(400).json({ error: 'URL do produto é obrigatória' })
    }

    // Extrair ID do produto da URL
    const productId = extrairProductIdDoUrl(url)
    if (!productId) {
      return res.status(400).json({ error: 'Não foi possível extrair o ID do produto da URL' })
    }

    console.log('Extraindo dados do produto:', productId)

    // Buscar dados na API do AliExpress
    const productData = await buscarProdutoAliExpress(productId)

    if (!productData) {
      return res.status(404).json({ error: 'Produto não encontrado ou erro na API' })
    }

    // Formatar dados para o frontend
    const formattedData = formatarDadosProduto(productData, affiliateUrl || '')

    return res.status(200).json({
      success: true,
      productId: productId,
      data: formattedData,
      extractedAt: new Date().toISOString()
    })

  } catch (error) {
    console.error('Erro na extração:', error)
    res.status(500).json({
      error: 'Erro interno do servidor',
      message: error.message
    })
  }
}

async function buscarProdutoAliExpress(productId) {
  try {
    const crypto = require('crypto')

    const appKey = process.env.ALIEXPRESS_APP_KEY || '521762'
    const appSecret = process.env.ALIEXPRESS_APP_SECRET || 'Eo8JzTpn28lJO4ooAsM82LX5it5cznzt'

    if (!appKey || !appSecret) {
      throw new Error('Credenciais AliExpress não configuradas')
    }

    const timestamp = Date.now().toString()

    const params = {
      app_key: appKey,
      method: 'aliexpress.affiliate.productdetail.get',
      sign_method: 'md5',
      timestamp: timestamp,
      format: 'json',
      v: '2.0',
      product_ids: productId,
      target_currency: 'BRL',
      target_language: 'PT',
      fields: 'product_id,product_title,product_main_image_url,sale_price,original_price,discount,evaluate_rate,commission_rate,lastest_volume_rate,shop_id,shop_name,shop_url,promotion_link'
    }

    // Construir string para assinatura
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

    console.log('Fazendo request para AliExpress API...')

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 10000 // 10 segundos timeout
    })

    const data = await response.json()

    console.log('Resposta da API:', response.status)

    if (data.error_response) {
      console.error('Erro da API AliExpress:', data.error_response)
      return null
    }

    // Verificar se encontrou o produto
    const products = data.resp_result?.result?.products || data.result?.products || []
    if (products.length === 0) {
      console.log('Produto não encontrado')
      return null
    }

    return products[0]

  } catch (error) {
    console.error('Erro ao buscar produto:', error)
    return null
  }
}

function formatarDadosProduto(apiData, affiliateUrl) {
  try {
    const product = apiData

    // Calcular desconto se não fornecido
    let desconto = product.discount || 0
    if (!desconto && product.original_price && product.sale_price) {
      const original = parseFloat(product.original_price)
      const sale = parseFloat(product.sale_price)
      if (original > 0) {
        desconto = Math.round(((original - sale) / original) * 100)
      }
    }

    // Formatar preços
    const formatarPreco = (preco) => {
      if (!preco) return ''
      const valor = parseFloat(preco)
      return `R$ ${valor.toFixed(2).replace('.', ',')}`
    }

    return {
      titulo: product.product_title || product.title || 'Produto AliExpress',
      descricao: `Produto de alta qualidade do AliExpress. Avaliação: ${product.evaluate_rate || 'N/A'} estrelas. Compre com confiança através do nosso link de afiliado.`,
      desconto: desconto,
      preco: formatarPreco(product.original_price),
      precoDesconto: formatarPreco(product.sale_price),
      categoria: 'Eletrônicos',
      linkCompra: affiliateUrl || product.promotion_link || '',
      fotos: product.product_main_image_url ? [product.product_main_image_url] : [],
      tipo: 'afiliado',
      destaque: desconto >= 30, // Destaque automático para descontos altos
      avaliacao: product.evaluate_rate || 0,
      comissao: product.commission_rate || 0,
      loja: product.shop_name || 'AliExpress',
      urlLoja: product.shop_url || ''
    }

  } catch (error) {
    console.error('Erro ao formatar dados:', error)
    return null
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