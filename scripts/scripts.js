import { products } from "./products-data.js";

// --- Экспортируемые функции для использования в других файлах ---
export function getCart() {
  const cartJson = localStorage.getItem("cart");
  return cartJson ? JSON.parse(cartJson) : [];
}

export function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

export function updateCartCounter() {
  const cart = getCart();
  let totalItems = 0;
  cart.forEach((item) => {
    totalItems += item.quantity;
  });
  document.querySelectorAll(".cart-counter").forEach((counter) => {
    if (totalItems > 0) {
      counter.textContent = totalItems > 9 ? "9+" : totalItems;
      counter.classList.add("visible");
    } else {
      counter.textContent = "0";
      counter.classList.remove("visible");
    }
  });
}

export function getFavoritesForUI() {
  const favoritesString = localStorage.getItem("favoritesItems");
  return favoritesString ? JSON.parse(favoritesString) : [];
}

export function saveFavorites(favorites) {
  localStorage.setItem("favoritesItems", JSON.stringify(favorites));
}

export function updateFavCounter() {
  const favorites = getFavoritesForUI();
  const totalFavorites = favorites.length;
  document.querySelectorAll(".fav-counter").forEach((counter) => {
    if (totalFavorites > 0) {
      counter.textContent = totalFavorites > 9 ? "9+" : totalFavorites;
      counter.classList.add("visible");
    } else {
      counter.textContent = "0";
      counter.classList.remove("visible");
    }
  });
}

export function updateFavIconsState() {
  const favorites = getFavoritesForUI();
  document.querySelectorAll(".fav-icon").forEach((icon) => {
    const productCard = icon.closest(".product-card");
    if (productCard) {
      const productId = productCard.dataset.id;
      if (favorites.some((item) => item.id === productId)) {
        icon.classList.add("fas");
        icon.classList.remove("far");
      } else {
        icon.classList.remove("fas");
        icon.classList.add("far");
      }
    }
  });
}

// --- Логика для mobile-footer-buttons (скрытые меню в футере) ---

// 1. Объявление переменных и получение элементов DOM
const companyButton = document.querySelector(".company-button");
const companyDropdown = document.querySelector(".company-dropdown");
const buyersButton = document.querySelector(".buyers-button");
const buyersDropdown = document.querySelector(".buyers-dropdown");

// 2. Функция-обработчик для переключения видимости дропдауна
function toggleDropdown(button, dropdown) {
  // Проверяем, открыт ли в данный момент другой дропдаун (гарантируем, что открыт только один)
  const isCompanyOpen =
    dropdown === buyersDropdown && companyDropdown.classList.contains("open");
  const isBuyersOpen =
    dropdown === companyDropdown && buyersDropdown.classList.contains("open"); // Если другой дропдаун открыт, закрываем его

  if (isCompanyOpen) {
    companyDropdown.classList.remove("open");
    companyButton.querySelector("i").classList.remove("fa-rotate-180");
  }
  if (isBuyersOpen) {
    buyersDropdown.classList.remove("open");
    buyersButton.querySelector("i").classList.remove("fa-rotate-180");
  } // Переключаем класс 'open' для текущего дропдауна (открытие/закрытие)

  dropdown.classList.toggle("open"); // Переворачиваем иконку шеврона для визуального эффекта

  const icon = button.querySelector("i");
  icon.classList.toggle("fa-rotate-180");
}

// 3. Обработчики кликов на кнопках
if (companyButton && companyDropdown) {
  companyButton.addEventListener("click", () => {
    toggleDropdown(companyButton, companyDropdown);
  });
}

if (buyersButton && buyersDropdown) {
  buyersButton.addEventListener("click", () => {
    toggleDropdown(buyersButton, buyersDropdown);
  });
}

// 4. Логика закрытия дропдауна при клике вне его
document.addEventListener("click", (event) => {
  const isClickInsideCompany =
    (companyButton && companyButton.contains(event.target)) ||
    (companyDropdown && companyDropdown.contains(event.target));
  const isClickInsideBuyers =
    (buyersButton && buyersButton.contains(event.target)) ||
    (buyersDropdown && buyersDropdown.contains(event.target)); // Закрыть Company, если клик был вне его, и он открыт

  if (
    companyDropdown &&
    !isClickInsideCompany &&
    companyDropdown.classList.contains("open")
  ) {
    companyDropdown.classList.remove("open");
    companyButton.querySelector("i").classList.remove("fa-rotate-180");
  } // Закрыть Buyers, если клик был вне его, и он открыт

  if (
    buyersDropdown &&
    !isClickInsideBuyers &&
    buyersDropdown.classList.contains("open")
  ) {
    buyersDropdown.classList.remove("open");
    buyersButton.querySelector("i").classList.remove("fa-rotate-180");
  }
});

// --- Конец логики для mobile-footer-buttons ---

// --- Логика, которая запускается при загрузке страницы (НЕ экспортируется) ---
document.addEventListener("DOMContentLoaded", () => {
  // --- Код для модального окна и авторизации ---
  const loginModal = document.getElementById("loginModal");
  const openLoginModalBtns = document.querySelectorAll(".open-login-modal-btn");
  const closeButton = document.querySelector(".modal-content .close-button");
  const togglePasswordVisibility = document.querySelector(
    ".toggle-password-visibility"
  );
  const passwordInput = document.getElementById("password");
  const loginForm = loginModal ? loginModal.querySelector("form") : null;
  const passwordError = document.getElementById("passwordError");

  if (loginModal) {
    openLoginModalBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        loginModal.style.display = "flex";
      });
    });

    closeButton.addEventListener("click", () => {
      loginModal.style.display = "none";
    });

    window.addEventListener("click", (e) => {
      if (e.target === loginModal) {
        loginModal.style.display = "none";
      }
    });

    if (togglePasswordVisibility) {
      togglePasswordVisibility.addEventListener("click", () => {
        const type =
          passwordInput.getAttribute("type") === "password"
            ? "text"
            : "password";
        passwordInput.setAttribute("type", type);
        togglePasswordVisibility.querySelector("i").classList.toggle("fa-eye");
        togglePasswordVisibility
          .querySelector("i")
          .classList.toggle("fa-eye-slash");
      });
    }

    if (loginForm) {
      loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const password = passwordInput.value;
        if (password.length < 8) {
          passwordError.style.display = "block";
        } else {
          passwordError.style.display = "none";
          console.log("Форма отправлена");
        }
      });
    }
  }

  // --- Код для переключения темы ---
  const themeToggle = document.getElementById("theme-toggle");
  const body = document.body;
  const currentTheme = localStorage.getItem("theme");
  if (currentTheme) {
    body.classList.add(currentTheme);
  } else {
    body.classList.add("light-theme");
  }

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      body.classList.toggle("light-theme");
      body.classList.toggle("dark-theme");
      const newTheme = body.classList.contains("dark-theme")
        ? "dark-theme"
        : "light-theme";
      localStorage.setItem("theme", newTheme);
    });
  }

  // --- ВОССТАНОВЛЕННЫЙ КОД ПОИСКА ИЗ СТАРОЙ ВЕРСИИ ---
  const searchInput = document.getElementById("search-input");
  const searchResultsContainer = document.querySelector(
    ".search-results-container"
  );
  const clearSearchBtn = document.getElementById("clear-search");

  function displayProducts(productsToDisplay) {
    const productResultsGrid = document.getElementById("product-results-grid");
    if (!productResultsGrid) {
      console.error("Элемент #product-results-grid не найден.");
      return;
    }

    productResultsGrid.innerHTML = "";

    if (productsToDisplay.length === 0) {
      productResultsGrid.innerHTML =
        '<p class="no-results">По вашему запросу ничего не найдено.</p>';
      return;
    }

    const currentPath = window.location.pathname;
    let productDetailBaseUrl = "./htmls/product-detail.html";

    if (currentPath.includes("/htmls/")) {
      productDetailBaseUrl = "./product-detail.html";
    }

    productsToDisplay.forEach((product) => {
      const productCard = document.createElement("a");
      productCard.href = `${productDetailBaseUrl}?id=${product.id}`;
      productCard.classList.add("product-card");
      productCard.innerHTML = `
        <div class="product-info">
          <h3 class="product-name">${product.name}</h3>
        </div>
      `;
      productResultsGrid.appendChild(productCard);
    });
  }

  if (searchInput && searchResultsContainer && clearSearchBtn) {
    searchInput.addEventListener("input", (event) => {
      const searchTerm = event.target.value.toLowerCase();

      if (searchTerm.length > 0) {
        clearSearchBtn.style.display = "block";
        const filteredProducts = products.filter((product) => {
          const productName = product.name?.toLowerCase() || "";
          return productName.includes(searchTerm);
        });
        searchResultsContainer.style.display = "block";
        displayProducts(filteredProducts);
      } else {
        clearSearchBtn.style.display = "none";
        searchResultsContainer.style.display = "none";
      }
    });

    clearSearchBtn.addEventListener("click", () => {
      searchInput.value = "";
      clearSearchBtn.style.display = "none";
      searchResultsContainer.style.display = "none";
    });

    document.addEventListener("click", (event) => {
      if (
        !searchInput.contains(event.target) &&
        !searchResultsContainer.contains(event.target)
      ) {
        searchResultsContainer.style.display = "none";
      }
    });
  }

  // --- Обработчики иконок корзины и избранного ---
  const addToCart = (product) => {
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
    updateCartIconColor();
    updateCartCounter();
  };

  const updateCartIconColor = () => {
    const cart = getCart();
    document.querySelectorAll(".cart-icon").forEach((icon) => {
      const productCard = icon.closest(".product-card");
      if (productCard) {
        const productId = productCard.dataset.id;
        if (cart.some((item) => item.id === productId)) {
          icon.classList.add("added-to-cart");
        } else {
          icon.classList.remove("added-to-cart");
        }
      }
    });
  };

  document.querySelectorAll(".cart-icon").forEach((icon) => {
    icon.addEventListener("click", (event) => {
      event.stopPropagation();
      const productCard = icon.closest(".product-card");
      if (productCard) {
        const product = {
          id: productCard.dataset.id,
          name: productCard.dataset.name,
          price: parseFloat(productCard.dataset.price),
          image: productCard.dataset.image,
        };
        addToCart(product);
      }
    });
  });

  document.querySelectorAll(".fav-icon").forEach((icon) => {
    icon.addEventListener("click", (event) => {
      event.stopPropagation();
      const productCard = icon.closest(".product-card");
      if (productCard) {
        const productId = productCard.dataset.id;
        let favorites = getFavoritesForUI();
        const existingProductIndex = favorites.findIndex(
          (item) => item.id === productId
        );

        if (existingProductIndex === -1) {
          const product = {
            id: productId,
            name: productCard.dataset.name,
            price: parseFloat(productCard.dataset.price),
            image: productCard.dataset.image,
            brand: productCard.dataset.brand,
            screenSize: productCard.dataset.screensize,
            resolution: productCard.dataset.resolution,
            technology: productCard.dataset.technology,
            processor: productCard.dataset.processor,
            ram: productCard.dataset.ram,
            storage: productCard.dataset.ssd,
            laptopScreenSize: productCard.dataset.screensize,
          };
          favorites.push(product);
        } else {
          favorites.splice(existingProductIndex, 1);
        }
        saveFavorites(favorites);
        updateFavIconsState();
        updateFavCounter();
      }
    });
  });

  updateCartIconColor();
  updateFavIconsState();
  updateCartCounter();
  updateFavCounter();
});
