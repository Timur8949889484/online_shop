// Импортируем только нужные функции из scripts.js
import { getCart, saveCart, updateCartCounter } from "./scripts.js";

// --- Функции для страницы корзины ---

// 4. Удаление товара из корзины
function removeFromCart(productId) {
  let cart = getCart();
  cart = cart.filter((item) => item.id !== productId);
  saveCart(cart);
  renderCartItems();
  updateCartCounter(); // ✨ ЭТА СТРОКА ОБНОВЛЯЕТ СЧЕТЧИК
}

// 5. Обновление количества товара
function updateCartQuantity(productId, newQuantity) {
  let cart = getCart();
  const productIndex = cart.findIndex((item) => item.id === productId);

  if (productIndex > -1) {
    newQuantity = parseInt(newQuantity);
    if (newQuantity > 0) {
      cart[productIndex].quantity = newQuantity;
    } else {
      cart = cart.filter((item) => item.id !== productId);
    }
    saveCart(cart);
    renderCartItems();
    updateCartCounter(); // ✨ ЭТА СТРОКА ОБНОВЛЯЕТ СЧЕТЧИК
  }
}

// 6. Рендеринг (отображение) товаров в корзине
function renderCartItems() {
  const cartItemsContainer = document.getElementById("cart-items-container");
  const cartTotalSpan = document.getElementById("cart-total");

  if (!cartItemsContainer || !cartTotalSpan) {
    return;
  }

  const cart = getCart();
  cartItemsContainer.innerHTML = "";

  let totalAmount = 0;

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = "<p>Ваша корзина пока пуста.</p>";
    cartTotalSpan.textContent = "0";
    return;
  }

  cart.forEach((item) => {
    const cartItemDiv = document.createElement("div");
    cartItemDiv.classList.add("cart-item");
    cartItemDiv.dataset.productId = item.id;

    cartItemDiv.innerHTML = `
            <div class="cart-item-image">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="cart-item-details">
                <h3>${item.name}</h3>
                <p>Цена за ед.: ${item.price.toLocaleString("ru-RU")} с</p>
                <div class="cart-item-quantity-control">
                    <button class="quantity-minus" data-id="${
                      item.id
                    }">-</button>
                    <input type="number" value="${
                      item.quantity
                    }" min="1" class="quantity-input" data-id="${item.id}">
                    <button class="quantity-plus" data-id="${
                      item.id
                    }">+</button>
                </div>
                <p>Сумма: <span class="item-total-price">${(
                  item.price * item.quantity
                ).toLocaleString("ru-RU")}</span> с</p>
            </div>
            <button class="remove-from-cart-btn" data-id="${item.id}">
                <i class="fas fa-trash-alt"></i> Удалить
            </button>
        `;
    cartItemsContainer.appendChild(cartItemDiv);
    totalAmount += item.price * item.quantity;
  });

  cartTotalSpan.textContent = totalAmount.toLocaleString("ru-RU");

  // Добавляем обработчики событий после создания элементов
  cartItemsContainer
    .querySelectorAll(".remove-from-cart-btn")
    .forEach((button) => {
      button.addEventListener("click", function () {
        const productId = this.dataset.id;
        removeFromCart(productId);
      });
    });

  cartItemsContainer.querySelectorAll(".quantity-minus").forEach((button) => {
    button.addEventListener("click", function () {
      const productId = this.dataset.id;
      const input = cartItemsContainer.querySelector(
        `.quantity-input[data-id="${productId}"]`
      );
      updateCartQuantity(productId, parseInt(input.value) - 1);
    });
  });

  cartItemsContainer.querySelectorAll(".quantity-plus").forEach((button) => {
    button.addEventListener("click", function () {
      const productId = this.dataset.id;
      const input = cartItemsContainer.querySelector(
        `.quantity-input[data-id="${productId}"]`
      );
      updateCartQuantity(productId, parseInt(input.value) + 1);
    });
  });

  cartItemsContainer.querySelectorAll(".quantity-input").forEach((input) => {
    input.addEventListener("change", function () {
      const productId = this.dataset.id;
      updateCartQuantity(productId, this.value);
    });
  });
}

// Обработчик кнопки "Оформить заказ"
const checkoutButton = document.querySelector(".checkout-button");
if (checkoutButton) {
  checkoutButton.addEventListener("click", function () {
    if (getCart().length > 0) {
      saveCart([]);
      renderCartItems();
      updateCartCounter(); // ✨ ЭТА СТРОКА ОБНОВЛЯЕТ СЧЕТЧИК
    } else {
    }
  });
}

// Запускаем рендеринг при загрузке страницы
if (
  document.getElementById("cart-items-container") &&
  document.getElementById("cart-total")
) {
  renderCartItems();
}
