// api/generate-sales-copy.js

/**
 * Gera textos de marketing técnicos e profissionais para componentes de hardware
 */

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { item } = req.body;

    if (!item) {
      return res.status(400).json({ error: 'Nenhum item fornecido.' });
    }

    // Simula delay de processamento de IA
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Extrair especificações técnicas
    const nome = item.nome || 'Componente';
    const preco = item.precoVenda || item.precoCusto || 0;
    const tipo = item.tipo || 'componente';
    const descricao = item.descricao || '';
    const compatibilidade = item.compatibilidade || {};

    // Templates técnicos por tipo de componente
    const templatesPorTipo = {
      cpu: gerarTextoCPU,
      gpu: gerarTextoGPU,
      ram: gerarTextoRAM,
      'placa-mae': gerarTextoPlacaMae,
      armazenamento: gerarTextoArmazenamento,
      fonte: gerarTextoFonte,
      gabinete: gerarTextoGabinete,
      outro: gerarTextoGenerico,
    };

    const gerador = templatesPorTipo[tipo] || gerarTextoGenerico;
    const salesCopy = gerador(nome, preco, descricao, compatibilidade);

    res.status(200).json(salesCopy);

  } catch (error) {
    console.error('Erro ao gerar copy:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
}

// ============================================================================
// GERADORES ESPECÍFICOS POR TIPO
// ============================================================================

function gerarTextoCPU(nome, preco, descricao, compat) {
  const socket = compat.socket || 'Socket universal';
  
  return {
    instagramPost: `⚡ PROCESSADOR EM DESTAQUE

${nome}

🔧 Especificações Técnicas:
• Socket: ${socket}
• Arquitetura de alto desempenho
• Ideal para gaming, edição e produtividade

💰 Investimento: R$ ${preco.toFixed(2)}

Compatível com as principais motherboards. Consulte disponibilidade e configurações recomendadas.

📩 DM para orçamento personalizado
🔗 Link na bio

#ProcessadorGamer #PC #Hardware #TechUpgrade #${nome.replace(/\s+/g, '')}`,

    whatsappStatus: `⚡ ${nome}
Socket ${socket} | R$ ${preco.toFixed(2)}

Performance comprovada para workstations e gaming.

Consulte compatibilidade: [seu contato]`,

    facebookPost: `[PROCESSADOR] ${nome}

Especificações:
→ Socket: ${socket}
→ Tecnologia: Arquitetura moderna
→ Aplicações: Gaming, renderização, multitarefa

Valor: R$ ${preco.toFixed(2)}

${descricao ? `\nDetalhes: ${descricao}` : ''}

Atendemos via WhatsApp com suporte técnico especializado. Consulte configurações completas de sistema.

Contato: [preencher]`,

    emailMarketing: `Assunto: ${nome} - Upgrade de Performance Garantido

Olá,

O ${nome} representa um salto significativo em processamento para seu setup.

ESPECIFICAÇÕES:
• Socket: ${socket}
• Aplicações ideais: Gaming AAA, edição de vídeo 4K, streaming
• Compatibilidade verificada com principais motherboards

INVESTIMENTO: R$ ${preco.toFixed(2)}

Incluímos:
✓ Suporte técnico pré-venda
✓ Orientação de compatibilidade
✓ Garantia de procedência

Entre em contato para consulta técnica detalhada.

Atenciosamente,
[Sua Loja]`,
  };
}

function gerarTextoGPU(nome, preco, descricao, compat) {
  return {
    instagramPost: `🎮 PLACA DE VÍDEO DISPONÍVEL

${nome}

🔥 Performance Gráfica:
• Arquitetura moderna
• VRAM de alta velocidade
• Ray tracing e DLSS compatível*

💻 Aplicações:
Gaming 1080p/1440p/4K
Edição de vídeo profissional
Renderização 3D

💰 R$ ${preco.toFixed(2)}

*Verifique modelo específico
Consulte PSU recomendada

📲 Chama no direct para specs completas

#GPU #PlacaDeVideo #PCGamer #Hardware #GraphicsCard`,

    whatsappStatus: `🎮 ${nome}
R$ ${preco.toFixed(2)}

GPU de alta performance para gaming e workstation.

Consulte compatibilidade PSU/Gabinete: [link]`,

    facebookPost: `[PLACA DE VÍDEO] ${nome}

Performance gráfica para quem leva a sério.

ESPECIFICAÇÕES:
→ Memória VRAM dedicada
→ Suporte a tecnologias modernas
→ Compatível com os principais games AAA

REQUISITOS:
→ Fonte de alimentação adequada (consulte watts recomendados)
→ Espaço no gabinete
→ PCIe x16

Valor: R$ ${preco.toFixed(2)}

${descricao ? `\n${descricao}` : ''}

Atendimento técnico especializado. Montamos seu setup completo.

Contato: [preencher]`,

    emailMarketing: `Assunto: ${nome} - Performance Gráfica Profissional

Prezado(a) Cliente,

A ${nome} está disponível para upgrade imediato do seu sistema.

CAPACIDADES:
• Gaming em alta resolução (Full HD, 2K, 4K*)
• Edição de vídeo com aceleração GPU
• Rendering 3D otimizado
• Suporte a múltiplos monitores

INVESTIMENTO: R$ ${preco.toFixed(2)}

IMPORTANTE:
Antes da compra, verifique:
✓ Potência da fonte (recomendado: 550W+)
✓ Compatibilidade do gabinete
✓ Slot PCIe disponível

Nossa equipe oferece consultoria técnica sem custo para garantir compatibilidade total.

*Performance varia conforme configuração do sistema.

[Sua Loja]`,
  };
}

function gerarTextoRAM(nome, preco, descricao, compat) {
  const tipoRam = compat.tipoRam || 'DDR4/DDR5';
  
  return {
    instagramPost: `💾 MEMÓRIA RAM

${nome}

⚡ Especificações:
• Tipo: ${tipoRam}
• Latência otimizada
• Compatibilidade verificada

🚀 Ganho de Performance:
Multitarefa fluida
Gaming sem gargalos
Produtividade acelerada

💰 R$ ${preco.toFixed(2)}

⚠️ Verifique compatibilidade com sua motherboard (slots e velocidade)

📩 DM para especificações detalhadas

#RAM #Memoria #UpgradePC #Hardware`,

    whatsappStatus: `💾 ${nome} (${tipoRam})
R$ ${preco.toFixed(2)}

Boost imediato no desempenho do seu PC.

Consulte compatibilidade: [contato]`,

    facebookPost: `[MEMÓRIA RAM] ${nome}

Tipo: ${tipoRam}

BENEFÍCIOS:
→ Eliminação de gargalos de memória
→ Multitarefa sem travamentos
→ Compatível com gaming e workstations

IMPORTANTE:
Confirme slots disponíveis na motherboard e velocidade suportada antes da compra.

Valor: R$ ${preco.toFixed(2)}

${descricao ? `\nDetalhes técnicos: ${descricao}` : ''}

Oferecemos suporte para verificação de compatibilidade. Entre em contato.

[Seu contato]`,

    emailMarketing: `Assunto: ${nome} - Upgrade de Memória RAM

Cliente,

A ${nome} oferece incremento imediato de performance.

ESPECIFICAÇÕES:
• Tipo: ${tipoRam}
• Frequência: Verifique specs do modelo
• CAS Latency: Otimizado para desempenho

APLICAÇÕES:
✓ Gaming (reduz stuttering)
✓ Edição de vídeo (timeline mais fluida)
✓ Desenvolvimento (compilação mais rápida)
✓ Multitarefa intensiva

INVESTIMENTO: R$ ${preco.toFixed(2)}

ANTES DE COMPRAR:
Confirme compatibilidade com sua motherboard (chipset e slots disponíveis).

Nossa equipe verifica gratuitamente se a RAM é compatível com seu sistema.

Atenciosamente,
[Sua Loja]`,
  };
}

function gerarTextoPlacaMae(nome, preco, descricao, compat) {
  const socket = compat.socket || 'Socket compatível';
  const tipoRam = compat.tipoRam || 'DDR4/DDR5';
  
  return {
    instagramPost: `🖥️ MOTHERBOARD

${nome}

🔧 Compatibilidade:
• Socket: ${socket}
• RAM: ${tipoRam}
• PCIe 4.0/5.0*

⚙️ Features:
VRM robusto
M.2 NVMe
USB 3.2+
Audio premium

💰 R$ ${preco.toFixed(2)}

Base sólida para seu build. Consulte chipset e features completas.

📲 DM para especificações

#Motherboard #PlacaMae #PCBuild #Hardware`,

    whatsappStatus: `🖥️ ${nome}
Socket ${socket} | ${tipoRam}
R$ ${preco.toFixed(2)}

Plataforma completa para seu setup.

Specs: [link]`,

    facebookPost: `[MOTHERBOARD] ${nome}

A base do seu sistema.

COMPATIBILIDADE:
→ Socket: ${socket}
→ Memória: ${tipoRam}
→ Expansão PCIe moderna

CARACTERÍSTICAS:
→ VRM de qualidade para overclock/estabilidade
→ Slots M.2 para SSDs NVMe
→ Conectividade USB 3.x
→ Áudio integrado de alta qualidade

Valor: R$ ${preco.toFixed(2)}

${descricao ? `\n${descricao}` : ''}

Fundamental: Verifique compatibilidade com CPU e RAM antes de adquirir.

Atendimento técnico: [contato]`,

    emailMarketing: `Assunto: ${nome} - Fundação do Seu Build

Cliente,

A motherboard ${nome} oferece a plataforma robusta que seu sistema precisa.

ESPECIFICAÇÕES:
• Socket: ${socket} (compatível com CPUs específicas)
• Suporte RAM: ${tipoRam}
• Slots de expansão: PCIe para GPU, NVMe, etc.
• Conectividade: USB, Ethernet, Áudio

INVESTIMENTO: R$ ${preco.toFixed(2)}

CHECKLIST PRÉ-COMPRA:
✓ CPU compatível com socket
✓ Memória RAM suportada (tipo e velocidade)
✓ Gabinete compatível (formato ATX/mATX/ITX)
✓ Fonte com conectores adequados

Oferecemos consultoria técnica completa para garantir compatibilidade total do seu build.

[Sua Loja]`,
  };
}

function gerarTextoArmazenamento(nome, preco, descricao, compat) {
  return {
    instagramPost: `💿 ARMAZENAMENTO

${nome}

⚡ Tecnologia:
SSD NVMe / SATA
Boot ultra-rápido
Transfer rates elevadas

📦 Aplicações:
Sistema operacional
Games (loading reduzido)
Arquivos de trabalho

💰 R$ ${preco.toFixed(2)}

⚠️ Verifique interface (M.2/SATA) e compatibilidade com motherboard

📩 DM para specs

#SSD #Armazenamento #NVMe #Hardware`,

    whatsappStatus: `💿 ${nome}
R$ ${preco.toFixed(2)}

SSD de alta velocidade para boot e aplicações.

Consulte interface: [contato]`,

    facebookPost: `[ARMAZENAMENTO] ${nome}

Velocidade que faz diferença.

PERFORMANCE:
→ Leitura/Escrita sequencial otimizada
→ IOPS elevado para responsividade
→ Ideal para SO, games e projetos

INTERFACE:
Confirme se sua motherboard possui slot M.2 NVMe ou porta SATA disponível.

Valor: R$ ${preco.toFixed(2)}

${descricao ? `\n${descricao}` : ''}

Upgrade que você sente na prática. Boot em segundos, apps instantâneos.

Contato: [preencher]`,

    emailMarketing: `Assunto: ${nome} - Performance em Armazenamento

Cliente,

O ${nome} eleva a responsividade do seu sistema.

BENEFÍCIOS:
• Boot do Windows em segundos
• Loading de games drasticamente reduzido
• Transferência de arquivos em velocidade máxima
• Durabilidade superior a HDDs

INVESTIMENTO: R$ ${preco.toFixed(2)}

COMPATIBILIDADE:
Verifique se sua motherboard possui:
✓ Slot M.2 (para NVMe)
✓ Porta SATA (para SSDs SATA)

Consultoria técnica disponível para esclarecer dúvidas sobre instalação.

Atenciosamente,
[Sua Loja]`,
  };
}

function gerarTextoFonte(nome, preco, descricao, compat) {
  return {
    instagramPost: `🔌 FONTE DE ALIMENTAÇÃO

${nome}

⚡ Confiabilidade:
Certificação 80 Plus*
Proteções OVP/OCP/SCP
Cabos modulares*

🛡️ Segurança:
Estabilidade de tensão
Componentes de qualidade
Garantia estendida

💰 R$ ${preco.toFixed(2)}

*Consulte modelo específico
⚠️ Calcule wattage necessário para seu sistema

📲 DM para recomendações

#Fonte #PSU #PowerSupply #Hardware`,

    whatsappStatus: `🔌 ${nome}
R$ ${preco.toFixed(2)}

Fonte confiável para estabilidade do seu PC.

Calcule wattage: [link]`,

    facebookPost: `[FONTE DE ALIMENTAÇÃO] ${nome}

A segurança e estabilidade do seu sistema.

CARACTERÍSTICAS:
→ Potência adequada para builds modernas
→ Certificação de eficiência energética
→ Proteções elétricas integradas
→ Conectores para GPU, motherboard, periféricos

IMPORTANTE:
Calcule o consumo total do seu sistema (CPU + GPU + periféricos) antes de escolher a fonte.

Valor: R$ ${preco.toFixed(2)}

${descricao ? `\n${descricao}` : ''}

Não economize na fonte - é a proteção do seu investimento em hardware.

Consultoria: [contato]`,

    emailMarketing: `Assunto: ${nome} - Estabilidade e Segurança

Cliente,

A fonte ${nome} garante operação estável e segura do seu sistema.

ESPECIFICAÇÕES:
• Potência: Adequada para builds modernas
• Certificação: Eficiência energética
• Proteções: OVP, OCP, UVP, SCP
• Cabos: Modulares/Semi-modulares/Fixos*

INVESTIMENTO: R$ ${preco.toFixed(2)}

COMO ESCOLHER:
1. Some consumo: CPU + GPU + 20% margem
2. Verifique conectores necessários (8-pin GPU, etc.)
3. Considere upgrades futuros

Nossa equipe calcula gratuitamente a fonte ideal para seu build.

*Varia conforme modelo.

[Sua Loja]`,
  };
}

function gerarTextoGabinete(nome, preco, descricao, compat) {
  return {
    instagramPost: `🏠 GABINETE

${nome}

🎨 Design:
Estética moderna
Painel lateral em vidro*
Iluminação RGB*

🌬️ Airflow:
Ventilação otimizada
Suporte para coolers
Gerenciamento de cabos

💰 R$ ${preco.toFixed(2)}

*Verifique modelo
⚠️ Confirme tamanho GPU/cooler compatível

📩 DM para especificações

#Gabinete #PCCase #Setup #Hardware`,

    whatsappStatus: `🏠 ${nome}
R$ ${preco.toFixed(2)}

Gabinete com airflow otimizado e design premium.

Specs: [link]`,

    facebookPost: `[GABINETE] ${nome}

A casa do seu hardware.

CARACTERÍSTICAS:
→ Formato: ATX/mATX/ITX (confirme)
→ Compatibilidade: GPUs até XXcm, coolers até YYcm
→ Ventilação: Suporte para múltiplos fans
→ Gerenciamento de cabos integrado

EXTRAS:
→ Painel lateral (vidro/acrílico/metal)
→ USB frontal (3.0+)
→ Filtros anti-poeira

Valor: R$ ${preco.toFixed(2)}

${descricao ? `\n${descricao}` : ''}

Verifique dimensões dos seus componentes antes de adquirir.

Contato: [preencher]`,

    emailMarketing: `Assunto: ${nome} - Estética e Funcionalidade

Cliente,

O gabinete ${nome} une design e performance térmica.

ESPECIFICAÇÕES:
• Formato: Suporte ATX/mATX/ITX*
• Clearance: GPU e CPU Cooler (consulte limites)
• Ventilação: Suporte para fans adicionais
• I/O Frontal: USB, áudio

INVESTIMENTO: R$ ${preco.toFixed(2)}

ANTES DE COMPRAR:
✓ Confirme tamanho da GPU
✓ Verifique altura do CPU cooler
✓ Confira formato da motherboard

Oferecemos consultoria para garantir que todos os componentes se encaixem perfeitamente.

*Varia conforme modelo.

[Sua Loja]`,
  };
}

function gerarTextoGenerico(nome, preco, descricao, compat) {
  return {
    instagramPost: `🔧 COMPONENTE DISPONÍVEL

${nome}

✨ Características:
Qualidade comprovada
Compatibilidade ampla
Performance garantida

💰 R$ ${preco.toFixed(2)}

${descricao ? `\n📝 ${descricao}` : ''}

📩 DM para mais informações e compatibilidade

#Hardware #PC #TechUpgrade #${nome.replace(/\s+/g, '')}`,

    whatsappStatus: `🔧 ${nome}
R$ ${preco.toFixed(2)}

Componente de qualidade para seu setup.

Consulte: [contato]`,

    facebookPost: `[COMPONENTE] ${nome}

${descricao || 'Componente de qualidade para seu sistema.'}

Valor: R$ ${preco.toFixed(2)}

Entre em contato para verificar compatibilidade com seu setup atual.

Atendimento especializado: [preencher]`,

    emailMarketing: `Assunto: ${nome} Disponível

Cliente,

O componente ${nome} está disponível para upgrade do seu sistema.

${descricao ? `\nDESCRIÇÃO:\n${descricao}` : ''}

INVESTIMENTO: R$ ${preco.toFixed(2)}

Entre em contato para verificar compatibilidade e especificações detalhadas.

Atenciosamente,
[Sua Loja]`,
  };
}
