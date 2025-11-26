# Dicas de Otimização de PC - TechVerse

## 📋 Índice
- [Memória RAM](#memória-ram)
- [Processador (CPU)](#processador-cpu)
- [Placa de Vídeo (GPU)](#placa-de-vídeo-gpu)
- [Armazenamento](#armazenamento)
- [Sistema Operacional](#sistema-operacional)
- [Rede e Conectividade](#rede-e-conectividade)
- [Manutenção Geral](#manutenção-geral)

---

## 🧠 Memória RAM

### Otimizações Avançadas de Memória

#### Memory Compression e Page Combining
```powershell
# Verificar status atual
Get-MMAgent

# Ativar Page Combining (economiza RAM)
Enable-MMAgent -PageCombining

# Desativar Application Launch Prefetching (libera RAM)
Disable-MMAgent -ApplicationLaunchPrefetching

# Ajustar limite de arquivos de API
Set-MMAgent -MaxOperationAPIFiles 512
```

#### XMP Profile (Extreme Memory Profile)
- **O que é**: Perfil de overclocking oficial da Intel para memórias
- **Como ativar**: Entrar na BIOS → Advanced → Memory Settings → XMP Profile
- **Benefício**: Pode aumentar frequência de 2133MHz para 3600MHz+
- **Compatibilidade**: Verificar QVL da placa-mãe

#### Dual Channel vs Single Channel
- **Verificação**: Use CPU-Z ou HWiNFO64
- **Otimização**: Garanta que módulos estão nos slots corretos (A2+B2 ou A1+B1)
- **Benefício**: Até 15-20% de melhoria na largura de banda

---

## ⚡ Processador (CPU)

### Precision Boost Overdrive (PBO) - AMD Ryzen
```powershell
# Verificar se PBO está ativo via HWiNFO64
# Configurações recomendadas na BIOS:
- PBO Limits: Manual
- PPT: 142W (para Ryzen 5 5600X)
- TDC: 95A
- EDC: 140A
```

### Intel Turbo Boost e SpeedStep
- **Turbo Boost**: Permite frequências acima do base clock
- **SpeedStep**: Ajusta tensão dinamicamente
- **Verificação**: HWiNFO64 → CPU Clock

### Thermal Throttling Prevention
- **Pasta térmica**: Substitua a cada 2-3 anos
- **Curvas de ventoinha**: Ajuste na BIOS ou software do fabricante
- **Temperaturas ideais**:
  - **Idle**: < 40°C
  - **Load normal**: < 75°C
  - **Load máxima**: < 85°C

---

## 🎮 Placa de Vídeo (GPU)

### Resize BAR (ReBAR) - Acesso Total à VRAM
```powershell
# Verificar se está ativo no HWiNFO64
# Como ativar:
1. Entrar na BIOS
2. Procurar "Resize BAR" ou "ReBAR"
3. Ativar (Above 4G Decoding também deve estar ativo)
4. Salvar e reiniciar
```

### NVIDIA Control Panel Otimizações
- **Gerenciar configurações 3D**:
  - Modo de energia: "Performance máxima"
  - CUDA: "Usar configurações globais"
  - V-Sync: "Forçado off" (para jogos competitivos)

### AMD Radeon Settings
- **System**: Ativar "Radeon Anti-Lag"
- **System**: Ativar "Radeon Boost"
- **Display**: Usar frequência de atualização variável

### Overclocking Seguro
- **Core Clock**: +50-100MHz inicialmente
- **Memory Clock**: +200-400MHz
- **Voltage**: Aumentar apenas se necessário
- **Teste**: FurMark + HWiNFO64 por 30min

---

## 💾 Armazenamento

### SSD Optimization
```batch
# Desfragmentar (não recomendado para SSD)
# Mas otimizar com:
defrag C: /O

# Verificar saúde do SSD
wmic diskdrive get status

# Habilitar TRIM
fsutil behavior query DisableDeleteNotify
# Se retornar 1, ative com:
fsutil behavior set DisableDeleteNotify 0
```

### HDD Optimization
```batch
# Desfragmentar HDDs mensalmente
defrag C: /D

# Verificar erros
chkdsk C: /F /R

# Desativar indexação em drives de jogos
# Propriedades do drive → Desmarcar "Permitir que os arquivos neste drive tenham conteúdo indexado"
```

### RAID Configuration
- **RAID 0**: Performance máxima, sem redundância
- **RAID 1**: Redundância, performance média
- **RAID 5**: Bom equilíbrio performance/redundância

---

## 🪟 Sistema Operacional

### Serviços do Windows para Desativar
```powershell
# Lista de serviços seguros para desativar:
Get-Service | Where-Object {$_.Name -like "*Fax*"} | Stop-Service -PassThru | Set-Service -StartupType Disabled
Get-Service | Where-Object {$_.Name -like "*Xbl*"} | Stop-Service -PassThru | Set-Service -StartupType Disabled
Get-Service | Where-Object {$_.Name -like "*SysMain*"} | Stop-Service -PassThru | Set-Service -StartupType Disabled
```

### Inicialização Limpa
```batch
# Verificar programas na inicialização
msconfig → Aba "Serviços" → "Não exibir serviços da Microsoft"
msconfig → Aba "Inicialização" → Desmarcar itens desnecessários
```

### Virtual Memory (Página)
- **Fórmula**: RAM × 1.5 + 1024MB
- **Mínimo**: Pelo menos o tamanho da RAM
- **Máximo**: 2-3 × tamanho da RAM
- **Localização**: SSD para melhor performance

---

## 🌐 Rede e Conectividade

### Otimização de Rede
```batch
# Resetar configurações de rede
netsh winsock reset
netsh int ip reset
ipconfig /release
ipconfig /renew
ipconfig /flushdns

# Otimizar TCP
netsh int tcp set global autotuninglevel=normal
netsh int tcp set global chimney=enabled
```

### DNS Otimizado
- **Google DNS**: 8.8.8.8 / 8.8.4.4
- **Cloudflare**: 1.1.1.1 / 1.0.0.1
- **Quad9**: 9.9.9.9 / 149.112.112.112

### Wi-Fi Optimization
- **Canal 2.4GHz**: Canais 1, 6 ou 11
- **Canal 5GHz**: Canais menos congestionados
- **Antena**: Posicione o roteador centralmente
- **QoS**: Ative Quality of Service para gaming

---

## 🔧 Manutenção Geral

### Limpeza e Manutenção
```batch
# Limpeza de disco
cleanmgr /sageset:1
cleanmgr /sagerun:1

# Limpar arquivos temporários
del /q /f /s %TEMP%\*
del /q /f /s C:\Windows\Temp\*

# Verificar integridade do sistema
sfc /scannow
DISM /Online /Cleanup-Image /RestoreHealth
```

### Monitoramento Contínuo
- **HWMonitor**: Temperaturas e volts
- **MSI Afterburner**: Overclocking e monitoramento
- **CrystalDiskInfo**: Saúde dos discos
- **LatencyMon**: Problemas de latência

### BIOS Updates
- **Importante**: Sempre backup antes de atualizar
- **AGESA**: Para AMD (melhora compatibilidade e performance)
- **ME Firmware**: Para Intel (correções de segurança)

---

## 🎯 Otimizações por Tipo de Uso

### Para Gaming
1. **CPU**: PBO ativo, temperaturas < 80°C
2. **GPU**: ReBAR ativo, drivers atualizados
3. **RAM**: XMP ativo, dual channel
4. **SSD**: Jogos no SSD, pagefile no HDD
5. **Rede**: DNS otimizado, QoS ativo

### Para Trabalho/Produção
1. **RAM**: Máxima possível (32GB+ recomendado)
2. **CPU**: Frequências estáveis
3. **Armazenamento**: RAID para projetos grandes
4. **Rede**: Conexão estável e rápida
5. **Virtualização**: Hyper-V desativado se não usado

### Para Uso Geral
1. **Inicialização limpa**: < 30s boot time
2. **Serviços otimizados**: Apenas essenciais ativos
3. **Armazenamento**: 20% espaço livre mínimo
4. **Manutenção**: Limpeza semanal automática

---

## ⚠️ Avisos Importantes

### Segurança Primeiro
- **Backup**: Sempre antes de mudanças na BIOS
- **Compatibilidade**: Verifique QVL para memórias
- **Garantia**: Overclock pode voidar garantia
- **Teste**: Use ferramentas de stress test

### Quando Procurar Ajuda
- **Temperaturas > 90°C**: Problema de resfriamento
- **BSOD frequente**: Drivers incompatíveis ou hardware defeituoso
- **Performance instável**: Verificar fonte de alimentação
- **Ruídos estranhos**: Manutenção preventiva necessária

---

*Este documento será atualizado conforme novas técnicas e tecnologias surgirem. Última atualização: Novembro 2024*