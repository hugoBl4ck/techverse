// api/generate-sales-copy.js

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { item } = req.body;

    if (!item) {
      return res.status(400).json({ error: 'Nenhum item fornecido.' });
    }

    // Simula um delay da API de IA
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Resposta mockada (hardcoded)
    const salesCopy = {
      instagramPost: `✨ Lançamento Exclusivo! ✨\n\nChegou o ${item.nome}, o upgrade que seu setup pedia! Com performance incrível, ele é perfeito para gamers e criadores de conteúdo. 🚀\n\nPor apenas R$ ${item.precoVenda?.toFixed(2)}!\n\nClique no link da bio para garantir o seu! 💻\n\n#tech #upgrade #pcgamer #${item.tipo || 'componente'} #${item.nome.replace(/\s+/g, '')}`,
      whatsappStatus: `🔥 ${item.nome} por apenas R$ ${item.precoVenda?.toFixed(2)}! 🔥 Estoque limitado. Me chama no privado! 🏃‍♂️💨`,
      facebookPost: `Pessoal, novidade na área! Para quem busca o máximo de desempenho, o ${item.nome} já está disponível.\n\nIdeal para ${item.descricao || 'jogos e trabalho pesado'}, ele entrega a performance que você precisa.\n\nValor: R$ ${item.precoVenda?.toFixed(2)}\n\nInteressados, mandem mensagem ou comentem aqui! 👇`,
    };

    res.status(200).json(salesCopy);

  } catch (error) {
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
}
