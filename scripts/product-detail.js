import { products } from "./products-data.js";
import {
  getCart,
  saveCart,
  getFavoritesForUI,
  saveFavorites,
  updateCartCounter,
  updateFavCounter,
  updateFavIconsState,
} from "./scripts.js";

document.addEventListener("DOMContentLoaded", () => {
  // Helper function to check if the device is mobile
  const isMobile = () => window.innerWidth <= 768;

  // RENDER FUNCTION (с тремя разными макетами: ТВ, смартфон, ноутбук)
  function renderProduct(product) {
    const productInfoSection = document.querySelector(".product-info-section");
    document.title = product.name;
    let productHTML;

    // Определяем тип устройства
    const isTelevision = product.technology !== undefined;
    const isLaptop = product.ram !== undefined;
    const isSmartphone = !isTelevision && !isLaptop;

    if (isMobile()) {
      // MOBILE HTML STRUCTURE
      if (isTelevision) {
        productHTML = `
          <div class="product-detail-container">
            <div class="product-main-content">
              <div class="product-detail-info">
                <h1 class="product-detail-name">${product.name}</h1>
                <p class="product-detail-brand">Бренд: <strong>${
                  product.brand
                }</strong></p>
                <div class="product-detail-image-wrapper">
                  <img src="${product.image}" alt="${
          product.name
        }" class="product-detail-img">
                </div>
                <div class="product-detail-specs">
                  <h3>Характеристики</h3>
                  <ul>
                    <li><strong>Размер экрана:</strong> ${
                      product.screenSize
                    } дюймов</li>
                    <li><strong>Разрешение:</strong> ${product.resolution}</li>
                    <li><strong>Технология экрана:</strong> ${
                      product.technology
                    }</li>
                    <li><strong>Smart TV:</strong> ${
                      product.smartTv ? "Да" : "Нет"
                    }</li>
                  </ul>
                </div>
                <div class="product-detail-price">
                  <span>Цена:</span>
                  <strong>${product.price.toLocaleString("ru-RU")} с</strong>
                </div>
                <p class="product-detail-description">${product.description}</p>
              </div>
            </div>
            <div class="product-detail-footer">
              <div class="product-detail-actions">
                <button class="product-action-btn add-to-cart-btn">
                  <i class="fas fa-shopping-cart"></i> Добавить в корзину
                </button>
                <button class="product-action-btn add-to-fav-btn">
                  <i class="fa-heart fav-icon"></i> В избранное
                </button>
              </div>
            </div>
          </div>
        `;
      } else if (isLaptop) {
        // LAPTOP MOBILE HTML
        productHTML = `
          <div class="product-detail-container">
            <div class="product-main-content">
              <div class="product-detail-info">
                <h1 class="product-detail-name">${product.name}</h1>
                <p class="product-detail-brand">Бренд: <strong>${
                  product.brand
                }</strong></p>
                <div class="product-detail-image-wrapper">
                  <img src="${product.image}" alt="${
          product.name
        }" class="product-detail-img">
                </div>
                <div class="product-detail-specs">
                  <h3>Характеристики</h3>
                  <ul>
                    <li><strong>Размер экрана:</strong> ${
                      product.screenSize
                    } дюймов</li>
                    <li><strong>Оперативная память:</strong> ${
                      product.ram
                    } ГБ</li>
                    <li><strong>Объем SSD:</strong> ${product.ssd} ГБ</li>
                  </ul>
                </div>
                <div class="product-detail-price">
                  <span>Цена:</span>
                  <strong>${product.price.toLocaleString("ru-RU")} с</strong>
                </div>
                <p class="product-detail-description">${product.description}</p>
              </div>
            </div>
            <div class="product-detail-footer">
              <div class="product-detail-actions">
                <button class="product-action-btn add-to-cart-btn">
                  <i class="fas fa-shopping-cart"></i> Добавить в корзину
                </button>
                <button class="product-action-btn add-to-fav-btn">
                  <i class="fa-heart fav-icon"></i> В избранное
                </button>
              </div>
            </div>
          </div>
        `;
      } else {
        // SMARTPHONE MOBILE HTML
        productHTML = `
          <div class="product-detail-container">
            <div class="product-main-content">
              <div class="product-detail-info">
                <h1 class="product-detail-name">${product.name}</h1>
                <p class="product-detail-brand">Бренд: <strong>${
                  product.brand
                }</strong></p>
                <div class="product-detail-image-wrapper">
                  <img src="${product.image}" alt="${
          product.name
        }" class="product-detail-img">
                </div>
                <div class="product-detail-specs">
                  <h3>Характеристики</h3>
                  <ul>
                    <li><strong>Память:</strong> ${product.memory} ГБ</li>
                    <li><strong>Камера:</strong> ${product.camera} (${
          product.megapixels
        } МП)</li>
                    <li><strong>Количество камер:</strong> ${
                      product.cameraCount
                    }</li>
                  </ul>
                </div>
                <div class="product-detail-price">
                  <span>Цена:</span>
                  <strong>${product.price.toLocaleString("ru-RU")} с</strong>
                </div>
                <p class="product-detail-description">${product.description}</p>
              </div>
            </div>
            <div class="product-detail-footer">
              <div class="product-detail-actions">
                <button class="product-action-btn add-to-cart-btn">
                  <i class="fas fa-shopping-cart"></i> Добавить в корзину
                </button>
                <button class="product-action-btn add-to-fav-btn">
                  <i class="fa-heart fav-icon"></i> В избранное
                </button>
              </div>
            </div>
          </div>
        `;
      }
    } else {
      // DESKTOP HTML STRUCTURE
      if (isTelevision) {
        productHTML = `
          <div class="product-detail-container">
            <div class="product-main-content">
              <div class="product-detail-info">
                <h1 class="product-detail-name">${product.name}</h1>
                <p class="product-detail-brand">Бренд: <strong>${
                  product.brand
                }</strong></p>
                <div class="product-detail-specs">
                  <h3>Характеристики</h3>
                  <ul>
                    <li><strong>Размер экрана:</strong> ${
                      product.screenSize
                    } дюймов</li>
                    <li><strong>Разрешение:</strong> ${product.resolution}</li>
                    <li><strong>Технология экрана:</strong> ${
                      product.technology
                    }</li>
                    <li><strong>Smart TV:</strong> ${
                      product.smartTv ? "Да" : "Нет"
                    }</li>
                  </ul>
                </div>
                <div class="product-detail-price">
                  <span>Цена:</span>
                  <strong>${product.price.toLocaleString("ru-RU")} с</strong>
                </div>
                <p class="product-detail-description">${product.description}</p>
              </div>
              <div class="product-detail-image-wrapper">
                <img src="${product.image}" alt="${
          product.name
        }" class="product-detail-img">
              </div>
            </div>
            <div class="product-detail-footer">
              <div class="product-detail-actions">
                <button class="product-action-btn add-to-cart-btn">
                  <i class="fas fa-shopping-cart"></i> Добавить в корзину
                </button>
                <button class="product-action-btn add-to-fav-btn">
                  <i class="fa-heart fav-icon"></i> В избранное
                </button>
              </div>
            </div>
          </div>
        `;
      } else if (isLaptop) {
        // LAPTOP DESKTOP HTML
        productHTML = `
          <div class="product-detail-container">
            <div class="product-main-content">
              <div class="product-detail-info">
                <h1 class="product-detail-name">${product.name}</h1>
                <p class="product-detail-brand">Бренд: <strong>${
                  product.brand
                }</strong></p>
                <div class="product-detail-specs">
                  <h3>Характеристики</h3>
                  <ul>
                    <li><strong>Размер экрана:</strong> ${
                      product.screenSize
                    } дюймов</li>
                    <li><strong>Оперативная память:</strong> ${
                      product.ram
                    } ГБ</li>
                    <li><strong>Объем SSD:</strong> ${product.ssd} ГБ</li>
                  </ul>
                </div>
                <div class="product-detail-price">
                  <span>Цена:</span>
                  <strong>${product.price.toLocaleString("ru-RU")} с</strong>
                </div>
                <p class="product-detail-description">${product.description}</p>
              </div>
              <div class="product-detail-image-wrapper">
                <img src="${product.image}" alt="${
          product.name
        }" class="product-detail-img">
              </div>
            </div>
            <div class="product-detail-footer">
              <div class="product-detail-actions">
                <button class="product-action-btn add-to-cart-btn">
                  <i class="fas fa-shopping-cart"></i> Добавить в корзину
                </button>
                <button class="product-action-btn add-to-fav-btn">
                  <i class="fa-heart fav-icon"></i> В избранное
                </button>
              </div>
            </div>
          </div>
        `;
      } else {
        // SMARTPHONE DESKTOP HTML
        productHTML = `
          <div class="product-detail-container">
            <div class="product-main-content">
              <div class="product-detail-info">
                <h1 class="product-detail-name">${product.name}</h1>
                <p class="product-detail-brand">Бренд: <strong>${
                  product.brand
                }</strong></p>
                <div class="product-detail-specs">
                  <h3>Характеристики</h3>
                  <ul>
                    <li><strong>Память:</strong> ${product.memory} ГБ</li>
                    <li><strong>Камера:</strong> ${product.camera} (${
          product.megapixels
        } МП)</li>
                    <li><strong>Количество камер:</strong> ${
                      product.cameraCount
                    }</li>
                  </ul>
                </div>
                <div class="product-detail-price">
                  <span>Цена:</span>
                  <strong>${product.price.toLocaleString("ru-RU")} с</strong>
                </div>
                <p class="product-detail-description">${product.description}</p>
              </div>
              <div class="product-detail-image-wrapper">
                <img src="${product.image}" alt="${
          product.name
        }" class="product-detail-img">
              </div>
            </div>
            <div class="product-detail-footer">
              <div class="product-detail-actions">
                <button class="product-action-btn add-to-cart-btn">
                  <i class="fas fa-shopping-cart"></i> Добавить в корзину
                </button>
                <button class="product-action-btn add-to-fav-btn">
                  <i class="fa-heart fav-icon"></i> В избранное
                </button>
              </div>
            </div>
          </div>
        `;
      }
    }
    productInfoSection.innerHTML = productHTML;
  }

  function addEventListeners(product) {
    const addToCartBtn = document.querySelector(".add-to-cart-btn");
    const addToFavBtn = document.querySelector(".add-to-fav-btn");
    const favIcon = addToFavBtn ? addToFavBtn.querySelector(".fav-icon") : null;

    // Мгновенно обновляем состояние иконки Избранного
    if (favIcon) {
      const favorites = getFavoritesForUI();
      if (favorites.some((item) => item.id === product.id)) {
        favIcon.classList.add("fas");
        favIcon.classList.remove("far");
      } else {
        favIcon.classList.add("far");
        favIcon.classList.remove("fas");
      }
    }

    if (addToCartBtn) {
      addToCartBtn.addEventListener("click", () => {
        let cart = getCart();
        const existingProductIndex = cart.findIndex(
          (item) => item.id === product.id
        );

        if (existingProductIndex > -1) {
          cart[existingProductIndex].quantity += 1;
        } else {
          cart.push({ ...product, quantity: 1 });
        }

        saveCart(cart);
        updateCartCounter(); // Мгновенное обновление счетчика корзины
        console.log("Текущая корзина:", cart);
      });
    }

    if (addToFavBtn && favIcon) {
      addToFavBtn.addEventListener("click", () => {
        let favorites = getFavoritesForUI();
        const existingProductIndex = favorites.findIndex(
          (item) => item.id === product.id
        );

        if (existingProductIndex === -1) {
          favorites.push(product);
          favIcon.classList.remove("far");
          favIcon.classList.add("fas");
        } else {
          favorites.splice(existingProductIndex, 1);
          favIcon.classList.remove("fas");
          favIcon.classList.add("far");
        }

        saveFavorites(favorites);
        updateFavCounter(); // Мгновенное обновление счетчика избранного
        console.log("Текущее избранное:", favorites);
      });
    }
  }

  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get("id");
  const productInfoSection = document.querySelector(".product-info-section");

  if (!productId) {
    if (productInfoSection) {
      productInfoSection.innerHTML =
        '<p class="error-message">Товар не найден.</p>';
    }
    return;
  }

  const product = products.find((p) => p.id === productId);

  if (product) {
    renderProduct(product);
    addEventListeners(product);
  } else {
    if (productInfoSection) {
      productInfoSection.innerHTML =
        '<p class="error-message">Товар не найден.</p>';
    }
  }

  window.addEventListener("resize", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get("id");
    const product = products.find((p) => p.id === productId);
    if (product) {
      renderProduct(product);
      addEventListeners(product);
    }
  });

  // Инициализируем счетчики при загрузке страницы
  updateCartCounter();
  updateFavCounter();
  updateFavIconsState();
});
