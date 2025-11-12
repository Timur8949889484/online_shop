// Импортируем только те функции, которые нужны на этой странице
import {
  getCart,
  saveCart,
  updateCartCounter,
  getFavoritesForUI,
  saveFavorites,
  updateFavCounter,
} from "./scripts.js";

document.addEventListener("DOMContentLoaded", () => {
  const favoritesContainer = document.getElementById("favorites-container");
  const emptyFavoritesMessage = document.getElementById(
    "empty-favorites-message"
  );
  const favoritesSummary = document.getElementById("favorites-summary");
  const favoritesTotalPriceSpan = document.getElementById(
    "favorites-total-price"
  );

  // --- Используем импортированные функции ---

  function removeFromFavorites(productId) {
    let favorites = getFavoritesForUI();
    favorites = favorites.filter((item) => item.id !== productId);
    saveFavorites(favorites);
    renderFavoritesItems();
    updateFavCounter(); // Обновляем счетчик после удаления
    console.log("Товар удален из избранного.");
  }

  function clearAllFavorites() {
    saveFavorites([]);
    renderFavoritesItems();
    updateFavCounter(); // Обновляем счетчик после очистки
    console.log("Список избранного очищен.");
  }

  function addAllFavoritesToCart() {
    let favorites = getFavoritesForUI();
    if (favorites.length === 0) {
      console.log(
        "Список избранного пуст. Нет товаров для добавления в корзину."
      );
      return;
    }

    let cart = getCart();
    let addedCount = 0;

    favorites.forEach((item) => {
      const existingProductIndex = cart.findIndex(
        (cartItem) => cartItem.id === item.id
      );
      if (existingProductIndex > -1) {
        cart[existingProductIndex].quantity += 1;
      } else {
        // Создаем новый объект товара для корзины, чтобы избежать ошибок
        const productForCart = {
          id: item.id,
          name: item.name,
          price: item.price,
          image: item.image,
          quantity: 1, // Добавляем свойство quantity
        };
        cart.push(productForCart);
      }
      addedCount++;
    });

    saveCart(cart);
    updateCartCounter(); // Обновляем счетчик корзины
    console.log(`Добавлено ${addedCount} товаров из избранного в корзину!`);
    console.log("Корзина после добавления всех избранных:", cart);
  }

  function addToCartFromFavorites(product) {
    let cart = getCart();
    const existingProductIndex = cart.findIndex(
      (item) => item.id === product.id
    );

    if (existingProductIndex > -1) {
      cart[existingProductIndex].quantity += 1;
    } else {
      product.quantity = 1;
      cart.push(product);
    }
    saveCart(cart);
    updateCartCounter(); // Обновляем счетчик корзины
    console.log(`${product.name} добавлен в корзину!`);
    console.log("Текущая корзина:", cart);
  }

  // --- Главная функция рендеринга избранных товаров ---
  function renderFavoritesItems() {
    favoritesContainer.innerHTML = "";
    const favorites = getFavoritesForUI();
    let totalFavoritesPrice = 0;

    if (favorites.length === 0) {
      emptyFavoritesMessage.style.display = "block";
      favoritesSummary.style.display = "none";
    } else {
      emptyFavoritesMessage.style.display = "none";
      favoritesSummary.style.display = "block";

      favorites.forEach((item) => {
        const favoriteItemDiv = document.createElement("div");
        favoriteItemDiv.classList.add("product-card");
        favoriteItemDiv.dataset.id = item.id;

        favoriteItemDiv.innerHTML = `
          <a href="product-detail.html?id=${item.id}" class="product-link">
            <div class="product-image-wrapper">
              <img src="${item.image}" alt="${item.name}" class="product-img">
            </div>
          </a>
          <div class="product-name">${item.name}</div>
          <div class="product-price">
            ${item.price.toLocaleString("ru-RU")} с
          </div>
          <button class="add-to-cart-from-fav-btn" 
              data-product-id="${item.id}"
              data-product-name="${item.name}"
              data-product-price="${item.price}"
              data-product-image="${item.image}">
            <i class="fas fa-shopping-cart"></i> Добавить в корзину
          </button>
          <button class="remove-from-favorites-btn" data-id="${item.id}">
            <i class="fas fa-trash-alt"></i> Удалить из избранного
          </button>
        `;
        favoritesContainer.appendChild(favoriteItemDiv);
        totalFavoritesPrice += item.price;
      });
    }

    if (favoritesTotalPriceSpan) {
      favoritesTotalPriceSpan.textContent =
        totalFavoritesPrice.toLocaleString("ru-RU");
    }

    addFavoritesPageEventListeners();
  }

  // --- Обработчики событий для кнопок на странице избранного ---
  function addFavoritesPageEventListeners() {
    document
      .querySelectorAll(".remove-from-favorites-btn")
      .forEach((button) => {
        button.onclick = null;
        button.addEventListener("click", function () {
          const productId = this.dataset.id;
          removeFromFavorites(productId);
        });
      });

    document.querySelectorAll(".add-to-cart-from-fav-btn").forEach((button) => {
      button.onclick = null;
      button.addEventListener("click", function () {
        const product = {
          id: this.dataset.productId,
          name: this.dataset.productName,
          price: parseFloat(this.dataset.productPrice),
          image: this.dataset.productImage,
          brand: this.dataset.productBrand,
          memory: this.dataset.productMemory,
        };
        addToCartFromFavorites(product);
      });
    });

    const clearFavoritesBtn = document.querySelector(".clear-favorites-btn");
    if (clearFavoritesBtn) {
      clearFavoritesBtn.onclick = null;
      clearFavoritesBtn.addEventListener("click", clearAllFavorites);
    }

    const addAllToCartBtn = document.querySelector(".add-all-to-cart-btn");
    if (addAllToCartBtn) {
      addAllToCartBtn.onclick = null;
      addAllToCartBtn.addEventListener("click", addAllFavoritesToCart);
    }
  }

  renderFavoritesItems();
});
