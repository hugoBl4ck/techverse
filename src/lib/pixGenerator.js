/**
 * Gerador de QR Code PIX
 * Cria QR codes estáticos e dinâmicos para PIX
 */

// Função para gerar QR Code usando API externa
export async function generatePixQRCode(pixKey, amount = 0, name = 'TechVerse', city = 'Sao Paulo') {
  try {
    // Aqui você pode usar uma API de QR Code
    // Opção 1: qrcode.react (mais comum)
    // Opção 2: API externa como QR Server

    const qrCodeApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(
      generatePixPayload(pixKey, amount, name, city)
    )}`;

    return qrCodeApiUrl;
  } catch (error) {
    console.error('Erro ao gerar QR Code:', error);
    throw error;
  }
}

/**
 * Gera o payload para PIX estático
 * Formato: BR code com validação
 */
export function generatePixPayload(pixKey, amount = 0, name = 'TechVerse', city = 'Sao Paulo') {
  try {
    // Dados básicos do BR Code
    const brCode = {
      '00': '01', // ID formato
      '01': '12', // Versão
      '26': {
        '00': '0014br.gov.bcb.pix', // URL PIX
        '01': '0014br.gov.bcb.brcode', // Identificador
        '02': pixKey // Chave PIX
      },
      '52': '0400', // Categoria comercial
      '53': '986', // Código da moeda (Real)
      '54': amount || '', // Valor (opcional para PIX estático)
      '55': '0', // Descrição
      '58': '05', // Código do País
      '59': name, // Nome do recebedor
      '60': city, // Cidade
      '62': {
        '05': generateTransactionId() // ID da transação
      }
    };

    return encodeBrCode(brCode);
  } catch (error) {
    console.error('Erro ao gerar payload PIX:', error);
    // Retorna um payload simplificado se houver erro
    return pixKey;
  }
}

/**
 * Codifica o BR Code para formato PIX
 */
function encodeBrCode(brCode) {
  let encoded = '';

  for (const [key, value] of Object.entries(brCode)) {
    if (typeof value === 'object' && value !== null) {
      encoded += encodeField(key, encodeNestedObject(value));
    } else if (value) {
      encoded += encodeField(key, value);
    }
  }

  // Adiciona CRC (checksum)
  encoded += '6304';
  const crc = calculateCRC16(encoded + '0000');
  encoded += crc;

  return encoded;
}

/**
 * Codifica objeto aninhado (para PIX e descritivo)
 */
function encodeNestedObject(obj) {
  let encoded = '';
  for (const [key, value] of Object.entries(obj)) {
    if (value) {
      encoded += encodeField(key, value);
    }
  }
  return encoded;
}

/**
 * Codifica um campo individual
 */
function encodeField(tag, value) {
  const str = String(value);
  const length = String(str.length).padStart(2, '0');
  return tag + length + str;
}

/**
 * Calcula checksum CRC16
 */
function calculateCRC16(str) {
  let crc = 0xffff;

  for (let i = 0; i < str.length; i++) {
    const byte = str.charCodeAt(i);
    crc ^= byte << 8;

    for (let j = 0; j < 8; j++) {
      crc = crc << 1;
      if (crc & 0x10000) {
        crc = (crc ^ 0x1021) & 0xffff;
      }
    }
  }

  return ('0000' + crc.toString(16).toUpperCase()).slice(-4);
}

/**
 * Gera um ID único para a transação
 */
function generateTransactionId() {
  return Math.random().toString(36).substr(2, 9).toUpperCase();
}

/**
 * Copia conteúdo PIX para o clipboard
 */
export function copyPixToClipboard(pixKey) {
  navigator.clipboard.writeText(pixKey);
}

/**
 * Valida uma chave PIX
 */
export function validatePixKey(key) {
  if (!key || key.trim() === '') return false;

  // Email
  if (key.includes('@')) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(key);
  }

  // Telefone (11 dígitos)
  if (/^\d{11}$/.test(key)) {
    return true;
  }

  // CPF (11 dígitos, pode ter formatação)
  if (/^\d{11}$/.test(key.replace(/\D/g, ''))) {
    return validateCPF(key.replace(/\D/g, ''));
  }

  // Chave aleatória (32 caracteres hexadecimais)
  if (/^[a-f0-9-]{36}$/.test(key)) {
    return true;
  }

  return false;
}

/**
 * Valida CPF
 */
function validateCPF(cpf) {
  if (cpf.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(cpf)) return false;

  let sum = 0;
  let remainder;

  for (let i = 1; i <= 9; i++) {
    sum += parseInt(cpf.substring(i - 1, i)) * (11 - i);
  }

  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cpf.substring(9, 10))) return false;

  sum = 0;
  for (let i = 1; i <= 10; i++) {
    sum += parseInt(cpf.substring(i - 1, i)) * (12 - i);
  }

  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cpf.substring(10, 11))) return false;

  return true;
}

/**
 * Formata um valor em reais para o padrão PIX
 */
export function formatPixAmount(value) {
  if (!value) return '0.00';
  return parseFloat(value).toFixed(2);
}

/**
 * Cria um link PIX copiável
 * Retorna um string formatada para copiar para o app bancário
 */
export function generatePixCopyPaste(pixKey, amount = 0, description = '') {
  const payload = generatePixPayload(pixKey, amount, 'TechVerse', 'Sao Paulo');
  return {
    payload,
    qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(payload)}`,
    pixKey,
    amount: formatPixAmount(amount)
  };
}

/**
 * Abre o app bancário com PIX (simulado)
 * Em produção, você precisaria usar deep linking específico de cada banco
 */
export function openBankAppWithPix(pixKey) {
  const url = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(pixKey)}`;

  // Tenta abrir o app bancário (implementação simplificada)
  if (navigator.userAgent.includes('Android')) {
    // Deep link para Android
    window.location.href = `intent://pay#Intent;scheme=https;end`;
  } else if (navigator.userAgent.includes('iPhone') || navigator.userAgent.includes('iPad')) {
    // Deep link para iOS
    window.location.href = `https://nubank.com.br`;
  } else {
    // Web
    window.open(url, '_blank');
  }
}
