// ===============================================
// produtos.js (COM IMAGENS REAIS DA WEB)
// ===============================================

// Se a imagem quebrar, usa placeholder
function imagemSegura(url) {
    if (!url || url.trim() === "") {
        return "https://via.placeholder.com/300?text=Imagem+Indisponivel";
    }
    return url;
}

// BANCO DE DADOS COM IMAGENS ATIVAS, REAIS E DA WEB
const ALL_PRODUCTS = [
    { 
        id: 101, 
        categoria: 'cao', 
        nome: 'Ração Cão Adulto Premium (15kg)', 
        preco: 185.99,
        descricao: 'Alimento completo para cães adultos de todas as raças.',
        imagem: 'https://cdn.pixabay.com/photo/2020/05/18/09/04/dog-food-5175619_1280.jpg'
    },
    { 
        id: 201, 
        categoria: 'gato', 
        nome: 'Sachê Salmão Gourmet (cx c/ 12 unid.)', 
        preco: 59.90,
        descricao: 'Alimento úmido delicioso e hidratante.',
        imagem: 'https://cdn.pixabay.com/photo/2016/08/25/07/44/cat-food-1612763_1280.jpg'
    },
    { 
        id: 102, 
        categoria: 'cao', 
        nome: 'Ossinho de Couro Desidratado', 
        preco: 15.00,
        descricao: 'Petisco natural que ajuda na higiene dental.',
        imagem: 'https://cdn.pixabay.com/photo/2015/03/26/09/42/dog-treats-690288_1280.jpg'
    },
    { 
        id: 202, 
        categoria: 'gato', 
        nome: 'Arranhador Torre 3 Andares', 
        preco: 149.00,
        descricao: 'Estrutura robusta com pompons e corda sisal.',
        imagem: 'https://images.pexels.com/photos/982300/pexels-photo-982300.jpeg'
    },
];

const CATEGORY_MAP = {
    'cao': { titulo: '🐶 Produtos Essenciais para Cães', descricao: 'Nutrição, higiene e brinquedos para seu cão.' },
    'gato': { titulo: '🐱 Produtos de Qualidade para Gatos', descricao: 'Conforto e sabor para seu felino.' },
    'default': { titulo: 'Todos os Produtos PetShop Pro', descricao: 'Explore nossa linha completa.' }
};

document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const categoria = params.get('pet') || 'default'; 
    const produtosFiltrados = ALL_PRODUCTS.filter(p => p.categoria === categoria || categoria === 'default');
    renderizarProdutos(categoria, produtosFiltrados);
});

function renderizarProdutos(categoria, produtos) {
    const listaContainer = document.getElementById('products-list'); 
    
    const categoryData = CATEGORY_MAP[categoria] || CATEGORY_MAP['default'];
    document.getElementById('category-title').textContent = categoryData.titulo;
    document.getElementById('category-description').textContent = categoryData.descricao;

    if (!listaContainer) return; 

    if (produtos.length === 0) {
        listaContainer.innerHTML = '<p>Nenhum produto encontrado nesta categoria.</p>';
        return;
    }

    let htmlContent = '';
    
    produtos.forEach(produto => {
        htmlContent += `
            <div class="product-item">
                <img src="${imagemSegura(produto.imagem)}" 
                     alt="${produto.nome}" 
                     class="product-img">

                <h3>${produto.nome}</h3>
                <p>${produto.descricao}</p>
                <p class="price">R$ ${produto.preco.toFixed(2).replace('.', ',')}</p>
                
                <button class="btn primary btn-add-to-cart" 
                        data-id="${produto.id}" 
                        data-nome="${produto.nome}" 
                        data-preco="${produto.preco}">
                    Adicionar ao Carrinho
                </button>
            </div>
        `;
    });

    listaContainer.innerHTML = htmlContent;
    configurarListenersCarrinhoProdutos();
}

function configurarListenersCarrinhoProdutos() {
    const botoesAdicionar = document.querySelectorAll('.btn-add-to-cart');
    
    botoesAdicionar.forEach(botao => {
        botao.addEventListener('click', () => {
            const id = botao.getAttribute('data-id');
            const nome = botao.getAttribute('data-nome');
            const preco = botao.getAttribute('data-preco');
            
            if (typeof adicionarAoCarrinho === 'function') {
                adicionarAoCarrinho(nome, preco, id); 
            } else {
                console.error("Erro: Função adicionarAoCarrinho não encontrada.");
            }
        });
    });
}
