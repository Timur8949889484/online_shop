document.addEventListener("DOMContentLoaded", () => {
  // 1. Объявление всех основных элементов и переменных (без изменений)
  const paginationLinksContainer = document.querySelector(
    ".product-pagination-links"
  );
  const prevPageBtn = document.querySelector(".product-prev-page");
  const nextPageBtn = document.querySelector(".product-next-page");
  const allProductCards = document.querySelectorAll(".product-card");
  const itemsPerPage = 12;
  const filterSidebar = document.querySelector(".filters-sidebar");
  const brandCheckboxes = filterSidebar
    ? filterSidebar.querySelectorAll('input[name="brand"]')
    : [];
  const screenSizeCheckboxes = filterSidebar
    ? filterSidebar.querySelectorAll('input[name="screen_size"]')
    : [];
  const resolutionCheckboxes = filterSidebar
    ? filterSidebar.querySelectorAll('input[name="resolution"]')
    : [];
  const technologyCheckboxes = filterSidebar
    ? filterSidebar.querySelectorAll('input[name="technology"]')
    : [];
  const smartTvCheckboxes = filterSidebar
    ? filterSidebar.querySelectorAll('input[name="smart_tv"]')
    : [];
  const processorCheckboxes = filterSidebar
    ? filterSidebar.querySelectorAll('input[name="processor"]')
    : [];
  const ramCheckboxes = filterSidebar
    ? filterSidebar.querySelectorAll('input[name="ram"]')
    : [];
  const storageCheckboxes = filterSidebar
    ? filterSidebar.querySelectorAll('input[name="ssd"]')
    : [];
  const laptopScreenSizeCheckboxes = filterSidebar
    ? filterSidebar.querySelectorAll('input[name="laptop-screen-size"]')
    : [];
  const priceRangeCheckboxes = filterSidebar
    ? filterSidebar.querySelectorAll('input[name="price_range_checkbox"]')
    : [];
  const priceMinInput = filterSidebar
    ? filterSidebar.querySelector(".price-min")
    : null;
  const priceMaxInput = filterSidebar
    ? filterSidebar.querySelector(".price-max")
    : null;
  const priceInputs = filterSidebar
    ? filterSidebar.querySelectorAll(".price-inputs input")
    : [];
  const showResultsBtn = document.querySelector(".show-results-btn");

  let currentFilteredCards = Array.from(allProductCards);
  let currentPage = 1;

  // 2. Логика для раскрывающихся фильтров (без изменений)
  const filterGroupHeaders = document.querySelectorAll(
    ".filter-group .filter-header"
  );
  filterGroupHeaders.forEach((header) => {
    header.addEventListener("click", () => {
      const filterContent = header.nextElementSibling;
      if (filterContent && filterContent.classList.contains("filter-content")) {
        filterContent.classList.toggle("active");
        header.classList.toggle("active");
      }
    });
  });

  const priceFilterContent = document.querySelector(".price-filter");
  if (priceFilterContent) {
    const priceFilterHeader = priceFilterContent.previousElementSibling;
    if (priceFilterHeader) {
      priceFilterHeader.classList.add("active");
      priceFilterContent.classList.add("active");
    }
  }

  // 3. Логика для инпутов цены (без изменений)
  priceInputs.forEach((input) => {
    const wrapper = input.closest(".price-input-wrapper");
    const clearBtn = wrapper ? wrapper.querySelector(".clear-input-btn") : null;
    const originalPlaceholder = input.placeholder;
    input.dataset.originalPlaceholder = originalPlaceholder;

    const minValue = parseFloat(input.dataset.minValue);
    const maxValue = parseFloat(input.dataset.maxValue);

    if (clearBtn) {
      if (input.value.trim() === "") {
        clearBtn.style.display = "none";
      } else {
        clearBtn.style.display = "block";
      }
    }

    const formatNumber = (num) => {
      return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    };

    const validateAndCorrectPrice = () => {
      let currentValue = parseFloat(input.value.replace(/\s/g, ""));
      if (isNaN(currentValue) || input.value.trim() === "") {
        input.value = "";
        input.placeholder = originalPlaceholder;
        if (clearBtn) clearBtn.style.display = "none";
        return;
      }
      if (currentValue < minValue) {
        currentValue = minValue;
      } else if (currentValue > maxValue) {
        currentValue = maxValue;
      }
      input.value = formatNumber(currentValue);
      input.placeholder = "";
      if (clearBtn) clearBtn.style.display = "block";
    };

    input.addEventListener("input", () => {
      let cleanValue = input.value.replace(/\D/g, "");
      cleanValue = cleanValue.substring(0, 10);
      input.value = cleanValue;

      if (clearBtn) {
        if (input.value.length > 0) {
          clearBtn.style.display = "block";
          input.placeholder = "";
        } else {
          clearBtn.style.display = "none";
          input.placeholder = originalPlaceholder;
        }
      }
    });

    input.addEventListener("focus", () => {
      if (input.value) {
        input.value = input.value.replace(/\s/g, "");
      }
    });
    input.addEventListener("blur", validateAndCorrectPrice);
    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        validateAndCorrectPrice();
        input.blur();
      }
    });
    if (clearBtn) {
      clearBtn.addEventListener("click", () => {
        input.value = "";
        input.placeholder = originalPlaceholder;
        clearBtn.style.display = "none";
        // Вызов фильтрации после сброса инпута цены
        applyFilters();
      });
    }
    validateAndCorrectPrice();
  });

  // 4. Главная функция фильтрации (без изменений)
  const applyFilters = () => {
    const selectedBrands = Array.from(brandCheckboxes)
      .filter((checkbox) => checkbox.checked)
      .map((checkbox) => checkbox.value);
    const selectedScreenSizes = Array.from(screenSizeCheckboxes)
      .filter((checkbox) => checkbox.checked)
      .map((checkbox) => checkbox.value);
    const selectedMemory = Array.from(
      document.querySelectorAll('input[name="memory"]:checked')
    ).map((checkbox) => parseInt(checkbox.value));
    const selectedCameraCounts = Array.from(
      document.querySelectorAll('input[name="camera-count"]:checked')
    ).map((checkbox) => parseInt(checkbox.value));
    const selectedCameraMPs = Array.from(
      document.querySelectorAll('input[name="camera-mp"]:checked')
    ).map((checkbox) => checkbox.value);
    const selectedResolutions = Array.from(resolutionCheckboxes)
      .filter((checkbox) => checkbox.checked)
      .map((checkbox) => checkbox.value);
    const selectedTechnologies = Array.from(technologyCheckboxes)
      .filter((checkbox) => checkbox.checked)
      .map((checkbox) => checkbox.value);
    const selectedSmartTvs = Array.from(smartTvCheckboxes)
      .filter((checkbox) => checkbox.checked)
      .map((checkbox) => checkbox.value === "true");
    const selectedProcessors = Array.from(processorCheckboxes)
      .filter((checkbox) => checkbox.checked)
      .map((checkbox) => checkbox.value);
    const selectedRams = Array.from(ramCheckboxes)
      .filter((checkbox) => checkbox.checked)
      .map((checkbox) => parseInt(checkbox.value));
    const selectedStorages = Array.from(storageCheckboxes)
      .filter((checkbox) => checkbox.checked)
      .map((checkbox) => parseInt(checkbox.value));
    const selectedLaptopScreenSizes = Array.from(laptopScreenSizeCheckboxes)
      .filter((checkbox) => checkbox.checked)
      .map((checkbox) => checkbox.value);
    const selectedPriceRanges = Array.from(priceRangeCheckboxes)
      .filter((checkbox) => checkbox.checked)
      .map((checkbox) => ({
        min: parseFloat(checkbox.dataset.min),
        max: parseFloat(checkbox.dataset.max),
      }));

    let minPrice = priceMinInput
      ? parseFloat(priceMinInput.value.replace(/\s/g, ""))
      : NaN;
    let maxPrice = priceMaxInput
      ? parseFloat(priceMaxInput.value.replace(/\s/g, ""))
      : NaN;
    if (isNaN(minPrice) && priceMinInput) {
      minPrice = parseFloat(priceMinInput.dataset.minValue);
    }
    if (isNaN(maxPrice) && priceMaxInput) {
      maxPrice = parseFloat(priceMaxInput.dataset.maxValue);
    }
    minPrice = isNaN(minPrice) ? 0 : minPrice;
    maxPrice = isNaN(maxPrice) ? Infinity : maxPrice;

    currentFilteredCards = [];
    allProductCards.forEach((card) => {
      const cardPrice = parseFloat(card.dataset.price);
      const cardBrand = card.dataset.brand;
      const cardScreenSizeTv = parseInt(card.dataset.screensize);
      const cardResolution = card.dataset.resolution;
      const cardTechnology = card.dataset.technology;
      const cardSmartTv = card.dataset.smartTv === "true";
      const cardMemory = parseInt(card.dataset.memory);
      const cardCameraCount = parseInt(card.dataset.cameraCount);
      const cardCameraMP = parseInt(card.dataset.megapixels);
      const cardProcessor = card.dataset.processor;
      const cardRam = parseInt(card.dataset.ram);
      const cardStorage = parseInt(card.dataset.ssd);
      const cardLaptopScreenSize = parseFloat(card.dataset.screensize);

      let passesAllFilters = true;
      const hasAllBrandSelected = selectedBrands.includes("all");

      if (selectedBrands.length > 0 && !hasAllBrandSelected) {
        if (!selectedBrands.includes(cardBrand)) {
          passesAllFilters = false;
        }
      }
      if (!passesAllFilters) return;

      if (selectedScreenSizes.length > 0) {
        let meetsScreenSizeFilter = false;
        for (const range of selectedScreenSizes) {
          const [min, max] = range.split("-").map(Number);
          if (cardScreenSizeTv >= min && cardScreenSizeTv <= max) {
            meetsScreenSizeFilter = true;
            break;
          }
        }
        if (!meetsScreenSizeFilter) {
          passesAllFilters = false;
        }
      }
      if (!passesAllFilters) return;

      if (
        selectedResolutions.length > 0 &&
        !selectedResolutions.includes(cardResolution)
      ) {
        passesAllFilters = false;
      }
      if (!passesAllFilters) return;

      if (
        selectedTechnologies.length > 0 &&
        !selectedTechnologies.includes(cardTechnology)
      ) {
        passesAllFilters = false;
      }
      if (!passesAllFilters) return;

      if (
        selectedSmartTvs.length > 0 &&
        !selectedSmartTvs.includes(cardSmartTv)
      ) {
        passesAllFilters = false;
      }
      if (!passesAllFilters) return;

      if (selectedMemory.length > 0 && !selectedMemory.includes(cardMemory)) {
        passesAllFilters = false;
      }
      if (!passesAllFilters) return;

      if (
        selectedCameraCounts.length > 0 &&
        !selectedCameraCounts.includes(cardCameraCount)
      ) {
        passesAllFilters = false;
      }
      if (!passesAllFilters) return;

      if (selectedCameraMPs.length > 0 && !isNaN(cardCameraMP)) {
        let meetsCameraMPFilter = false;
        for (const range of selectedCameraMPs) {
          const [min, max] = range.split("-").map(Number);
          if (cardCameraMP >= min && cardCameraMP <= max) {
            meetsCameraMPFilter = true;
            break;
          }
        }
        if (!meetsCameraMPFilter) {
          passesAllFilters = false;
        }
      }
      if (!passesAllFilters) return;

      if (
        selectedProcessors.length > 0 &&
        !selectedProcessors.includes(cardProcessor)
      ) {
        passesAllFilters = false;
      }
      if (!passesAllFilters) return;

      if (selectedRams.length > 0 && !selectedRams.includes(cardRam)) {
        passesAllFilters = false;
      }
      if (!passesAllFilters) return;

      if (
        selectedStorages.length > 0 &&
        !selectedStorages.includes(cardStorage)
      ) {
        passesAllFilters = false;
      }
      if (!passesAllFilters) return;

      if (selectedLaptopScreenSizes.length > 0) {
        let meetsLaptopScreenSizeFilter = false;
        for (const range of selectedLaptopScreenSizes) {
          const [min, max] = range.split("-").map(Number);
          if (cardLaptopScreenSize >= min && cardLaptopScreenSize <= max) {
            meetsLaptopScreenSizeFilter = true;
            break;
          }
        }
        if (!meetsLaptopScreenSizeFilter) {
          passesAllFilters = false;
        }
      }
      if (!passesAllFilters) return;

      if (selectedPriceRanges.length === 0) {
        if (cardPrice < minPrice || cardPrice > maxPrice) {
          passesAllFilters = false;
        }
      } else {
        let meetsPriceRangeCheckbox = false;
        for (const range of selectedPriceRanges) {
          if (cardPrice >= range.min && cardPrice <= range.max) {
            meetsPriceRangeCheckbox = true;
            break;
          }
        }
        if (!meetsPriceRangeCheckbox) {
          passesAllFilters = false;
        }
      }
      if (passesAllFilters) {
        currentFilteredCards.push(card);
      }
    });
    updateDisplayAndPagination();
  };

  // 5. Функции для пагинации (без изменений)
  const updateDisplayAndPagination = () => {
    allProductCards.forEach((card) => card.classList.add("hidden"));
    const totalPages = Math.ceil(currentFilteredCards.length / itemsPerPage);
    if (currentPage > totalPages && totalPages > 0) {
      currentPage = totalPages;
    } else if (totalPages === 0) {
      currentPage = 1;
    }
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const cardsToShowOnCurrentPage = currentFilteredCards.slice(
      startIndex,
      endIndex
    );
    cardsToShowOnCurrentPage.forEach((card) => card.classList.remove("hidden"));
    updatePaginationUI(totalPages);
  };

  const updatePaginationUI = (totalPages) => {
    paginationLinksContainer.innerHTML = "";
    if (totalPages > 1) {
      for (let i = 1; i <= totalPages; i++) {
        const link = document.createElement("a");
        link.href = "#";
        link.classList.add("product-pagination-link");
        link.dataset.page = i;
        link.textContent = i;
        if (i === currentPage) {
          link.classList.add("active");
        }
        link.addEventListener("click", (e) => {
          e.preventDefault();
          const clickedPage = parseInt(e.target.dataset.page);
          currentPage = clickedPage;
          updateDisplayAndPagination();
        });
        paginationLinksContainer.appendChild(link);
      }
    }
  };

  const showResultsButton = document.querySelector(".apply-filters-btn");
  if (showResultsButton) {
    showResultsButton.addEventListener("click", applyFilters);
  }

  // ОБНОВЛЕНИЕ: Заменяем старый, дублирующий showResultsBtn.
  if (showResultsBtn) {
    showResultsBtn.addEventListener("click", () => {
      currentPage = 1;
      applyFilters();
    });
  }

  // Инициализация. Вызываем фильтрацию при загрузке страницы.
  applyFilters();

  // Дополнительная логика (из старого файла)
  const filterGroups = document.querySelectorAll(
    ".filters-sidebar .filter-group"
  );
  filterGroups.forEach((group) => {
    const resetButton = group.querySelector(".filter-reset-btn");
    if (resetButton) {
      resetButton.addEventListener("click", () => {
        const checkboxes = group.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach((checkbox) => {
          checkbox.checked = false;
        });
        const priceInputsInGroup = group.querySelectorAll(
          ".price-inputs input"
        );
        priceInputsInGroup.forEach((input) => {
          const wrapper = input.closest(".price-input-wrapper");
          const clearBtn = wrapper
            ? wrapper.querySelector(".clear-input-btn")
            : null;
          input.value = "";
          input.placeholder = input.dataset.originalPlaceholder;
          if (clearBtn) clearBtn.style.display = "none";
          if (input.classList.contains("price-min") && input.dataset.minValue) {
            input.placeholder = `от ${input.dataset.minValue.replace(
              /\B(?=(\d{3})+(?!\d))/g,
              " "
            )}`;
          } else if (
            input.classList.contains("price-max") &&
            input.dataset.maxValue
          ) {
            input.placeholder = `до ${input.dataset.maxValue.replace(
              /\B(?=(\d{3})+(?!\d))/g,
              " "
            )}`;
          }
        });
        // Вызываем фильтрацию после сброса
        currentPage = 1;
        applyFilters();
      });
    }
  });

  // Логика для кнопок "Вперёд" и "Назад"
  if (prevPageBtn) {
    prevPageBtn.addEventListener("click", () => {
      if (currentPage > 1) {
        currentPage--;
        updateDisplayAndPagination();
      }
    });
  }

  if (nextPageBtn) {
    nextPageBtn.addEventListener("click", () => {
      const totalPages = Math.ceil(currentFilteredCards.length / itemsPerPage);
      if (currentPage < totalPages) {
        currentPage++;
        updateDisplayAndPagination();
      }
    });
  }
});
