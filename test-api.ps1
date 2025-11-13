# Script para testar a API do AliExpress

# Teste 1: Com ID do produto
Write-Host "=== Teste 1: Produto específico ===" -ForegroundColor Green
$response = Invoke-RestMethod `
  -Uri "https://techverseapp.vercel.app/api/test-aliexpress" `
  -Method POST `
  -ContentType "application/json" `
  -Body (ConvertTo-Json @{
    productId = "1005009384380972"
  })

Write-Host "Resultado:" -ForegroundColor Yellow
$response | ConvertTo-Json -Depth 10 | Write-Host

# Teste 2: Com URL do produto (comentado, descomente para usar)
# Write-Host "`n=== Teste 2: Com URL ===" -ForegroundColor Green
# $response = Invoke-RestMethod `
#   -Uri "https://techverseapp.vercel.app/api/test-aliexpress" `
#   -Method POST `
#   -ContentType "application/json" `
#   -Body (ConvertTo-Json @{
#     url = "https://www.aliexpress.us/item/1005009384380972.html"
#   })

# Write-Host "Resultado:" -ForegroundColor Yellow
# $response | ConvertTo-Json -Depth 10 | Write-Host
