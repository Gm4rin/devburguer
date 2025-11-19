const menu = document.getElementById("Menu");
const cartbtn = document.getElementById("cart-btn"); 
const cartModal = document.getElementById("cart-modal");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const checkoutBtn = document.getElementById("checkout-btn");
const closeModalBtn = document.getElementById("close-modal-btn");
const cartCount = document.getElementById("cart-count");
const addressInput = document.getElementById("address"); 
const addressWarn = document.getElementById("address-warn"); 

let cart = []; // Variável global do carrinho


// ===========================================
// LÓGICA DO MODAL (ABRIR E FECHAR)
// ===========================================

// 1. ABRIR O MODAL
cartbtn.addEventListener("click", function() {
// Remove 'hidden' e garante que 'flex' esteja lá para centralizar
cartModal.classList.remove("hidden");
cartModal.classList.add("flex");
});

// 2. FECHAR O MODAL - Ao clicar no botão "Fechar"
closeModalBtn.addEventListener("click", function() {
// Adiciona 'hidden' para fechar
cartModal.classList.add("hidden");
cartModal.classList.remove("flex");
});

// 3. FECHAR O MODAL - Ao clicar na área escura (Fora da Área Branca)
cartModal.addEventListener("click", function(event) {
if (event.target === cartModal) {
cartModal.classList.add("hidden");
cartModal.classList.remove("flex");
}
});


// ===========================================
// LÓGICA DO CARRINHO (ADICIONAR)
// ===========================================

// Função para adicionar item ao carrinho
function addtoCart(name, price) {
// Verifica se o item já existe no carrinho
const existingItem = cart.find(item => item.name === name);

if (existingItem) {
existingItem.quantity += 1;
} else {
cart.push({
    name,
    price,
    quantity: 1
});
}
updateCartModal();
}

// 4. LÓGICA DE CLIQUE NO MENU (CORRIGIDA)
menu.addEventListener("click", function(event) {
// Verifica se o clique foi no botão de adicionar ou em um de seus filhos
let parentButton = event.target.closest(".add-to-cart-btn");

if (parentButton) {
// Atributos lidos corretamente (name/price)
const name = parentButton.getAttribute("data-name");
const price = parseFloat(parentButton.getAttribute("data-price")); 

addtoCart(name, price);
}
});


// ===========================================
// LÓGICA DO CARRINHO (REMOVER)
// ===========================================

// Função para remover item do carrinho
function removeItemCart(name) {
const index = cart.findIndex(item => item.name === name);

if(index !== -1) {
const item = cart[index];

if(item.quantity > 1){
    item.quantity -= 1;
    updateCartModal();
    return;
}

// Remove o item inteiro se a quantidade for 1
cart.splice(index, 1);
updateCartModal();
}
}

// 6. EVENT LISTENER PARA REMOVER ITENS
cartItemsContainer.addEventListener("click", function(event) {
if (event.target.classList.contains("remove-btn")) {
const name = event.target.getAttribute("data-name");
removeItemCart(name);
}
});


// ===========================================
// ATUALIZAÇÃO VISUAL DO MODAL
// ===========================================

function updateCartModal() {
cartItemsContainer.innerHTML = "";
let total = 0;

cart.forEach(item => {
const cartItemElement = document.createElement("div");
// Ajustado para melhor layout do item
cartItemElement.classList.add("flex", "justify-between", "items-center", "border-b", "py-2"); 

const itemTotal = item.price * item.quantity;
total += itemTotal;

// Exibe o preço unitário com R$ e duas casas decimais
const formattedPrice = "R$ " + item.price.toFixed(2); 

cartItemElement.innerHTML = `
    <div class="flex items-center justify-between w-full">
        <div class="flex flex-col">
            <p class="font-bold">${item.name}</p>
            <p>Qtd: ${item.quantity}</p>
            <p class="font-medium mt-2">${formattedPrice}</p>
        </div>
        
        <button class="remove-btn bg-red-500 text-white px-3 py-1 rounded-md" 
                data-name="${item.name}">
            Remover
        </button>
    </div>
`;
cartItemsContainer.appendChild(cartItemElement);
// O event listener para remoção está no cartItemsContainer (delegação de eventos)
});

// Atualiza o total com R$
cartTotal.innerText = "R$ " + total.toFixed(2);
// Atualiza o contador de itens
cartCount.innerText = cart.length; 
}


// ===========================================
// LÓGICA DE VALIDAÇÃO E CHECKOUT
// ===========================================

// Validação de endereço
addressInput.addEventListener("input", function(event) {
let inpuValue = event.target.value;

if(inpuValue !== ""){
addressInput.classList.remove("border-red-500");
addressWarn.classList.add("hidden");
}
})

// Lógica de finalização de compra (WhatsApp)
checkoutBtn.addEventListener("click", function() {

const isopen = checkRestaurantOpen();
if(!isopen){

Toastify({
text: "Ops o restaurante está fechado! O pedido só pode ser finalizado durante o horário de funcionamento.",
duration: 3000,
close: true,
gravity: "top", 
position: "right",
stopOnFocus: true,
style: {
    background: "#ef4444",
},
}).showToast();

return;
}

if(cart.length === 0) return;

// Validação de endereço
if(addressInput.value === ""){
addressWarn.classList.remove("hidden");
addressInput.classList.add("border-red-500");
return;
}

// Enviar pedido para api do whatsapp
const cartItems = cart.map((item) =>{
return (
    // Formatação para quebra de linha (\n) e negrito (*) no WhatsApp
    `*${item.name}* | Qtd: (${item.quantity}) | R$ ${item.price.toFixed(2)}`                                         
)
}).join("\n") // Quebra de linha entre os itens

const totalOrder = "R$ " + cartTotal.innerText.replace("R$ ", "");

const message = encodeURIComponent(`*NOVO PEDIDO:*\n\n${cartItems}\n\n*Total do Pedido:* ${totalOrder}\n*Endereço:* ${addressInput.value}`);

// Substitua o número de telefone
const phone ="43991411567"

window.open(`https://wa.me/${phone}?text=${message}`, "_blank")

// Limpa o carrinho e fecha o modal após o envio
cart = [];
updateCartModal();
cartModal.classList.add("hidden");
cartModal.classList.remove("flex");

});

// Verifica se o restaurante está aberto
function checkRestaurantOpen (){
const data = new Date ();
const hora = data.getHours();
// Horário de funcionamento: 11:00 às 22:00
return hora >= 18 && hora < 22;
}

// Aplica o estilo de aberto/fechado na UI
const spanItem = document.getElementById("date-span");
const isOpen = checkRestaurantOpen();

if(isOpen){
spanItem.classList.remove("bg-red-500");
spanItem.classList.add("bg-green-600");
}else{
spanItem.classList.remove("bg-green-600");
spanItem.classList.add("bg-red-500");
}