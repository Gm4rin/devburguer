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


// 1. ABRIR O MODAL
cartbtn.addEventListener("click", function() {
// Remove 'hidden' para mostrar e garante que 'flex' esteja lá para centralizar
cartModal.classList.remove("hidden");
cartModal.classList.add("flex");
});

// 2. FECHAR O MODAL - Ao clicar no botão "Fechar"
closeModalBtn.addEventListener("click", function() {
// Adiciona 'hidden' para fechar e 'flex' é desativado
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

menu.addEventListener("click", function(event) {
let parentButton = event.target.closest(".add-to-cart-btn");

if (!parentButton){
const name = parentButton.getAttribute("data-price")
const price = parseFloat(parentButton.getAttribute("data-name"))

}
})
let cart = []; // Variável global do carrinho

// Função para adicionar item ao carrinho
function addtoCart(name, price) {
// 1. Verifica se o item já existe no carrinho
const existingItem = cart.find(item => item.name === name);

if (existingItem) {
// Se existir, apenas aumenta a quantidade
existingItem.quantity += 1;
} else {
// Se não existir, adiciona como um novo item
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
// Verifica se o clique foi em um elemento que tem a classe 'add-to-cart-btn' ou é filho dele
let parentButton = event.target.closest(".add-to-cart-btn");

// CORREÇÃO 1: A lógica do IF foi invertida
if (parentButton) {
// CORREÇÃO 2: Atributos lidos corretamente (name/price)
const name = parentButton.getAttribute("data-name");
// Converte o preço para número decimal
const price = parseFloat(parentButton.getAttribute("data-price")); 

// Chama a função para adicionar ao carrinho
addtoCart(name, price);
}
});

// 5. ATUALIZA O MODAL DO CARRINHO (CORRIGIDA)
function updateCartModal() {
cartItemsContainer.innerHTML = ""; // Limpa o conteúdo
let total = 0;

cart.forEach(item => {
const cartItemElement = document.createElement("div");
cartItemElement.classList.add("flex", "justify-between", "flex-col", "mb-4");
// Adiciona classes Tailwind para layout


const itemTotal = item.price * item.quantity;
total += itemTotal;

// CORREÇÃO 3 & 4: Erro de digitação (rice -> price) e tags HTML fechadas
cartItemElement.innerHTML = `
<div class="flex items-center justify-between ">
<div class="flex flex-col">
<p class="font-bold">${item.name}</p>
<p>Qtd: ${item.quantity}</p>
<p class="font-medium mt-2">R$ ${item.price.toFixed(2)}</p>
</div>

<button class="remove-btn bg-red-500 text-white px-3 py-1 rounded-md" 
data-name="${item.name}">
Remover
</button>
</div>
`;
cartItemsContainer.appendChild(cartItemElement);
});

// Atualiza o total
cartTotal.innerText = "R$" + total.toFixed(2);
// Atualiza o contador de itens (opcional, mas bom para a UI)
cartCount.innerText = cart.length; 
}

// 6. REMOVER ITENS DO CARRINHO
cartItemsContainer.addEventListener("click", function(event) {
if (event.target.classList.contains("remove-btn")) {
const name = event.target.getAttribute("data-name")
removeItemCart(name);
}
})

function removeItemCart(name) {
const index = cart.findIndex(item => item.name === name);

if(index !== -1) {
const item = cart[index];

if(item.quantity > 1){
item.quantity -= 1;
updateCartModal();
return;
}

cart.splice(index, 1);
updateCartModal();
}

}
//adrress
addressInput.addEventListener("input", function(event) {
    let inpuValue = event.target.value;

    if(inpuValue !== ""){
        addressInput.classList.remove("border-red-500");
        addressWarn.classList.add("hidden");
    }

})
//finalizar compra
checkoutBtn.addEventListener("click", function() {
    
    const isopen = checkRestaurantOpen();
    if(!isopen){
        
        Toastify({
        text: "Ops o restaurante está fechado!",
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
     if(addressInput.value === ""){
        addressWarn.classList.remove("hidden");
        addressInput.classList.add("border-red-500");
        return;
     }

//enviar pedido para api do whatsapp
     const cartItems = cart.map((item) =>{
        return (
          `${item.name} Quantidade: (${item.quantity}) Preço: R$${item.price}`                                         
        )
     }).join("")

    const message = encodeURIComponent(cartItems)
    const phone ="43991411567"
    
    window.open(`https://wa.me/${phone}?text=${message} Endereço: ${addressInput.value}`, "_blank")

    cart = [];
    updateCartModal();

})
//verifica se o restaurante esta aberto
function checkRestaurantOpen (){
    const data = new Date ();
    const hora = data.getHours();
    return hora >= 18 && hora < 22;
}
const spanItem = document.getElementById("date-span");
const isOpen = checkRestaurantOpen();

if(isOpen){
    spanItem.classList.remove("bg-red-500")
    spanItem.classList.add("bg-green-600")
}else{
    spanItem.classList.remove("bg-green-600")
    spanItem.classList.add("bg-red-500")
}


