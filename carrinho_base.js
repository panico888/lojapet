// ===============================================
//               carrinho_base.js
// ===============================================

const WHATSAPP_NUMBER = "5511999999999"; // Troque pelo seu número
const INTRO_MESSAGE = "Olá! Gostaria de fazer o seguinte pedido na PetShop Pro:\n\n";

let carrinho = [];

// Espera o DOM carregar
document.addEventListener('DOMContentLoaded', () => {
    carregarCarrinho();

    // Ativa botão de WhatsApp
    const btnFinalizar = document.getElementById('btn-finalizar-whatsapp');
    if (btnFinalizar) {
        btnFinalizar.addEventListener('click', gerarLinkWhatsApp);
    }
});

/** Carrega itens do localStorage */
function carregarCarrinho() {
    const carrinhoSalvo = localStorage.getItem('petshopProCarrinho');
    if (carrinhoSalvo) {
        carrinho = JSON.parse(carrinhoSalvo);
    }
    atualizarContadorCarrinho();
}

/** Salva o carrinho no localStorage */
function salvarCarrinho() {
    localStorage.setItem('petshopProCarrinho', JSON.stringify(carrinho));
}

/** Adiciona produto ao carrinho */
function adicionarAoCarrinho(nome, preco, id) {
    const precoNumerico = parseFloat(preco);
    const idNumerico = parseInt(id);

    const itemExistente = carrinho.find(item => item.id === idNumerico);

    if (itemExistente) {
        itemExistente.quantidade++;
    } else {
        carrinho.push({ id: idNumerico, nome, preco: precoNumerico, quantidade: 1 });
    }

    salvarCarrinho();
    atualizarContadorCarrinho();

    console.log(`✅ ${nome} adicionado.`);
}

/** Atualiza contador no header e total no checkout */
function atualizarContadorCarrinho() {
    const contador = document.querySelector('.carrinho-contador');
    const btnFinalizar = document.getElementById('btn-finalizar-whatsapp');
    const totalDisplay = document.getElementById('total-carrinho-display');

    const totalItens = carrinho.reduce((total, item) => total + item.quantidade, 0);
    const totalGeral = carrinho.reduce((total, item) => total + (item.preco * item.quantidade), 0);

    if (contador) {
        contador.textContent = totalItens;
        contador.style.display = totalItens > 0 ? 'inline-block' : 'none'; // inline-block é melhor
    }

    if (btnFinalizar && totalDisplay) {
        if (totalItens > 0) {
            btnFinalizar.style.display = 'block';
            totalDisplay.textContent = `Total do Carrinho: R$ ${totalGeral.toFixed(2).replace('.', ',')}`;
        } else {
            btnFinalizar.style.display = 'none';
            totalDisplay.textContent = 'Seu carrinho está vazio.';
        }
    }
}

/** Remove item do carrinho */
function removerDoCarrinho(id) {
    carrinho = carrinho.filter(item => item.id !== id);
    salvarCarrinho();
    atualizarContadorCarrinho();

    if (typeof renderizarCarrinho === "function") {
        renderizarCarrinho();
    }
}

/** Gera link do WhatsApp */
function gerarLinkWhatsApp() {
    if (carrinho.length === 0) {
        alert("Seu carrinho está vazio. Adicione produtos antes de finalizar.");
        return;
    }

    let mensagemPedido = INTRO_MESSAGE;
    let totalGeral = 0;

    carrinho.forEach((item, index) => {
        const subtotal = item.preco * item.quantidade;
        totalGeral += subtotal;

        mensagemPedido += 
            `*${index + 1}. ${item.nome}*\n` +
            `   - Qtd: ${item.quantidade}\n` +
            `   - Preço Unit: R$ ${item.preco.toFixed(2).replace('.', ',')}\n` +
            `   - Subtotal: R$ ${subtotal.toFixed(2).replace('.', ',')}\n`;
    });

    mensagemPedido += 
        `-------------------------\n` +
        `*TOTAL GERAL: R$ ${totalGeral.toFixed(2).replace('.', ',')}*\n` +
        `-------------------------\n` +
        `Aguardando confirmação de pagamento e entrega.`;

    const encodedMessage = encodeURIComponent(mensagemPedido);
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encodedMessage}`;

    window.open(whatsappUrl, '_blank');
    

    

}
