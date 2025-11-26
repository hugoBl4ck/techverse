# Guia de Configuração da API AliExpress

## Problema Atual
A função de validação da API do AliExpress não está funcionando porque:
1. As credenciais podem estar inválidas
2. A assinatura MD5 pode estar incorreta
3. O formato dos parâmetros pode estar errado

## Solução

### 1. Verificar Credenciais
Você precisa ter:
- `ALIEXPRESS_API_KEY` (app_key)
- `ALIEXPRESS_SECRET` (app_secret) - opcional, mas recomendado

Se não tiver, você pode:
- Obter em: https://aliexpress.com/affapply
- Registrar como afiliado no AliExpress

### 2. Variáveis de Ambiente
No arquivo `.env` ou `.env.local`, adicione:
```
ALIEXPRESS_API_KEY=sua_app_key_aqui
ALIEXPRESS_SECRET=sua_app_secret_aqui
```

### 3. Testar a API

#### Via Vercel (Remoto)
```powershell
$response = Invoke-RestMethod `
  -Uri "https://techverseapp.vercel.app/api/test-aliexpress" `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"productId":"1005009384380972"}'

$response | ConvertTo-Json -Depth 10
```

#### Via Localhost (Local)
```powershell
npm run dev  # Primeiro, inicie o servidor local

# Em outra janela/aba:
$response = Invoke-RestMethod `
  -Uri "http://localhost:5173/api/test-aliexpress" `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"productId":"1005009384380972"}'

$response | ConvertTo-Json -Depth 10
```

### 4. Esperado na Resposta

#### Sucesso:
```json
{
  "produtoId": "1005009384380972",
  "resultado": {
    "statusCode": 200,
    "productFound": true,
    "productsCount": 1,
    "responseBody": {
      "resp_result": {
        "result": {
          "products": [
            {
              "product_id": 1005009384380972,
              "product_title": "Nome do Produto"
            }
          ]
        }
      }
    }
  }
}
```

#### Erro (credenciais inválidas):
```json
{
  "resultado": {
    "hasError": true,
    "errorDetails": {
      "code": 20001,
      "msg": "Invalid App Key"
    }
  }
}
```

### 5. Se Não Tiver Credenciais

**Opção A: Usar a validação local (sem API)**
O código já suporta isso. Se `ALIEXPRESS_API_KEY` não existir:
- Normaliza a URL do AliExpress
- Mantém os parâmetros de afiliado
- NÃO valida com a API (apenas processa o link)

**Opção B: Desativar validação por enquanto**
Comente a chamada `chamarAPIAliExpress` e confie apenas na normalização.

### 6. Troubleshooting

#### Se receber "Invalid App Key"
- Verifique se a chave está correta no `.env`
- Verifique se a variável está sendo carregada
- Tente gerar uma nova chave no painel AliExpress

#### Se receber "Invalid Signature"
- A assinatura MD5 está errada
- Verifique se `app_secret` está correto
- O timestamp pode estar em formato errado

#### Se receber erro de rede
- Verifique conexão com internet
- Proxy/firewall pode estar bloqueando
- A URL da API pode estar errada

## Próximos Passos

1. Obtenha credenciais do AliExpress Affiliate Program
2. Configure `.env` com as credenciais
3. Execute o teste (veja acima)
4. Se funcionar, a validação automática de produtos será ativada
5. Se não funcionar, o sistema continuará funcionando com links apenas normalizados

## Arquivo de Teste

Use `/api/test-aliexpress` para validar a configuração sem afetar o gerador de promoções.

```powershell
# Teste rápido
Invoke-RestMethod -Uri "https://techverseapp.vercel.app/api/test-aliexpress" -Method POST -Body '{"productId":"1005009384380972"}' -ContentType "application/json" | ConvertTo-Json
```
