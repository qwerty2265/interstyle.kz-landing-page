document.addEventListener('DOMContentLoaded', function() {
  const orderButton = document.getElementById('order-button');
  const productBuyButtons = document.querySelectorAll('.product-buy-button');
  const modalOverlay = document.getElementById('modal-overlay');
  const modalClose = document.getElementById('modal-close');
  const orderForm = document.getElementById('order-form');
  const formSuccess = document.getElementById('form-success');
  
  if (orderButton) {
    orderButton.addEventListener('click', function() {
      modalOverlay.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    });
  }
  
  document.addEventListener('click', function(event) {
    const buyButton = event.target.closest('.product-buy-button');
    if (buyButton) {
      modalOverlay.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    }
  });

  if (modalClose) {
    modalClose.addEventListener('click', function() {
      closeModal();
    });
  }
  
  if (modalOverlay) {
    modalOverlay.addEventListener('click', function(event) {
      if (event.target === modalOverlay) {
        closeModal();
      }
    });
  }
  
  function closeModal() {
    modalOverlay.style.display = 'none';
    document.body.style.overflow = ''; 
    if (orderForm) orderForm.style.display = 'block';
    if (formSuccess) formSuccess.style.display = 'none';
  }
  
  if (orderForm) {
    orderForm.addEventListener('submit', function(event) {
      event.preventDefault();

      const submitButton = orderForm.querySelector('.submit-button');
      if (submitButton) {
        submitButton.disabled = true;
        submitButton.classList.add('loading');
      }

      const formData = new FormData(orderForm);
      
      fetch('sendmail.php', {
        method: 'POST',
        body: formData
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          orderForm.style.display = 'none';
          formSuccess.style.display = 'block';
        } else {
          alert('Ошибка: ' + data.error);
        }
      })
      .catch(error => {
        console.error('Ошибка отправки формы:', error);
        alert('Произошла ошибка при отправке формы');
      })
      .finally(() => {
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.classList.remove('loading');
        }
      });
    });
  }

const productContainer = document.querySelector('.products.container');
const productList = document.getElementById('product-list');
const productsIndicators = document.getElementById('product-indicators');
const productLeftButton = document.getElementById('product-left-button');
const productRightButton = document.getElementById('product-right-button');
  
if (productList && productsIndicators) {
  const productSlides = Array.from(productList.querySelectorAll('li'));
  let productSlideCount = productSlides.length;
  let currentProductSlide = 0;
  let productAutoPlayInterval = null;
  let isProductAnimating = false;
  let isProductDragBlocked = false;
  let productsPerView = 1;
  
  function updateProductsPerView() {
    let newProductsPerView;
    
    if (window.matchMedia('(min-width: 992px)').matches) {
      newProductsPerView = 3;
    } else if (window.matchMedia('(min-width: 768px)').matches) {
      newProductsPerView = 2;
    } else {
      newProductsPerView = 1;
    }
    
    const wasChanged = productsPerView !== newProductsPerView;
    productsPerView = newProductsPerView;
    
    if (wasChanged) {
      adjustProductSlidesWidth();
    }
    
    return wasChanged;
  }
  
  function adjustProductSlidesWidth() {
    const allSlides = productList.querySelectorAll('li');
    const slideWidth = 100 / productsPerView;
    allSlides.forEach(slide => {
      slide.style.flex = `0 0 ${slideWidth}%`;
      slide.style.width = `${slideWidth}%`;
    });
  }
  
  updateProductsPerView();
  
  productSlides.forEach((_, index) => {
    const indicator = document.createElement('div');
    indicator.classList.add('indicator');
    if (index === 0) indicator.classList.add('active');
    indicator.addEventListener('click', () => {
      if (!isProductAnimating && !isProductDragBlocked) {
        clearInterval(productAutoPlayInterval);
        goToProductSlide(index + productSlideCount);
        startProductAutoScroll();
      }
    });
    productsIndicators.appendChild(indicator);
  });
  
  function updateProductIndicators() {
    const normalizedIndex = (currentProductSlide % productSlideCount + productSlideCount) % productSlideCount;
    const indicators = productsIndicators.querySelectorAll('.indicator');
    
    indicators.forEach((indicator, index) => {
      if (index === normalizedIndex) {
        indicator.classList.add('active');
      } else {
        indicator.classList.remove('active');
      }
    });
  }
  
    function getProductSlideWidth() {
    if (productContainer) {
      return productContainer.offsetWidth / productsPerView;
    }
    return productList.offsetWidth / productsPerView;
  }
  
  function goToProductSlide(index) {
    if (isProductAnimating) return;
    
    isProductAnimating = true;
    currentProductSlide = index;
    
    const slideWidth = getProductSlideWidth();
    productList.style.transition = 'transform 0.5s ease-out';
    productList.style.transform = `translateX(${-currentProductSlide * slideWidth}px)`;
    
    updateProductIndicators();
  }
  
  function nextProductSlide() {
    if (isProductAnimating || isProductDragBlocked) return;
    goToProductSlide(currentProductSlide + 1);
  }
  
  function prevProductSlide() {
    if (isProductAnimating || isProductDragBlocked) return;
    goToProductSlide(currentProductSlide - 1);
  }
  
  function startProductAutoScroll() {
    if (productAutoPlayInterval) {
      clearInterval(productAutoPlayInterval);
    }
    productAutoPlayInterval = setInterval(() => {
      if (!isProductAnimating && !isProductDragBlocked) {
        nextProductSlide();
      }
    }, 5000);
  }

  function attachBuyButtonHandlers() {
    const allBuyButtons = document.querySelectorAll('.product-buy-button');
    allBuyButtons.forEach(button => {
      button.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        wasDragging = false;
        isProductDragging = false;
        modalOverlay.style.display = 'flex';
        document.body.style.overflow = 'hidden';
      });
    });
  }

  function setupProductInfiniteScroll() {
    const beforeClones = [];
    const afterClones = [];
    productSlides.forEach((slide) => {
      const beforeClone = slide.cloneNode(true);
      beforeClone.classList.add('cloned-slide');
      beforeClone.setAttribute('aria-hidden', 'true');
      beforeClones.push(beforeClone);
      const afterClone = slide.cloneNode(true);
      afterClone.classList.add('cloned-slide');
      afterClone.setAttribute('aria-hidden', 'true');
      afterClones.push(afterClone);
    });
    beforeClones.reverse().forEach(clone => {
      productList.insertBefore(clone, productList.firstChild);
    });
    afterClones.forEach(clone => {
      productList.appendChild(clone);
    });
    adjustProductSlidesWidth();
    attachBuyButtonHandlers();
    currentProductSlide = productSlideCount;
    const slideWidth = getProductSlideWidth();
    productList.style.transition = 'none';
    productList.style.transform = `translateX(${-currentProductSlide * slideWidth}px)`;
    void productList.offsetWidth;
    productList.style.transition = 'transform 0.5s ease-out';
  }
  
  function forceUnblockProductCarousel() {
    isProductDragBlocked = false;
    isProductAnimating = false;
    startProductAutoScroll();
  }
  
  setTimeout(forceUnblockProductCarousel, 3000);
  
  productList.addEventListener('transitionend', function(e) {
    if (e.propertyName !== 'transform' || !isProductAnimating) return;
    const totalSlides = productList.children.length;
    const slideWidth = getProductSlideWidth();
    if (currentProductSlide <= productSlideCount - 1) {
      productList.style.transition = 'none';
      currentProductSlide = currentProductSlide + productSlideCount;
      productList.style.transform = `translateX(${-currentProductSlide * slideWidth}px)`;
    } else if (currentProductSlide >= totalSlides - productSlideCount) {
      productList.style.transition = 'none';
      currentProductSlide = currentProductSlide - productSlideCount;
      productList.style.transform = `translateX(${-currentProductSlide * slideWidth}px)`;
    }
    void productList.offsetWidth;
    productList.style.transition = 'transform 0.5s ease-out';
    isProductAnimating = false;
  });
  
  let isProductDragging = false;
  let productStartX = 0;
  let productStartTranslate = 0;
  let productLastDragPosition = 0;
  
  function getProductPositionX(event) {
    return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
  }
  
  function productDragStart(e) {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'mousedown') {
      const selection = window.getSelection();
      if (selection.rangeCount > 0) {
        selection.removeAllRanges();
      }
  }
    if (isProductAnimating || isProductDragBlocked) return;
    productStartX = getProductPositionX(e);
    productLastDragPosition = productStartX;
    isProductDragging = true;
    const transformValue = window.getComputedStyle(productList).transform;
    const matrix = new DOMMatrixReadOnly(transformValue);
    productStartTranslate = matrix.m41;
    clearInterval(productAutoPlayInterval);
    productList.style.transition = 'none';
    document.body.classList.add('dragging-active');
    document.body.style.userSelect = 'none';
    document.body.style.webkitUserSelect = 'none';
  }
  
  function productDrag(e) {
    if (!isProductDragging) return;
    e.preventDefault();
    e.stopPropagation();
    const currentPosition = getProductPositionX(e);
    productLastDragPosition = currentPosition;
    const diff = currentPosition - productStartX;
    productList.style.transform = `translateX(${productStartTranslate + diff}px)`;
  }
  
  function productDragEnd(e) {
    if (!isProductDragging) return;
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    isProductDragging = false;
    productList.style.cursor = '';
    document.body.classList.remove('dragging-active');
    document.body.style.userSelect = '';
    document.body.style.webkitUserSelect = '';
    productList.style.transition = 'transform 0.5s ease-out';
    const diff = productLastDragPosition - productStartX;
    const slideWidth = getProductSlideWidth();
    if (Math.abs(diff) > slideWidth * 0.2) {
      if (diff > 0) {
        prevProductSlide();
      } else {
        nextProductSlide();
      }
    } else {
      productList.style.transform = `translateX(${-currentProductSlide * slideWidth}px)`;
    }
    startProductAutoScroll();
  }
  
function forceProductDragEnd() {
  if (isProductDragging) {
    isProductDragging = false;
    productList.style.cursor = '';
    document.body.classList.remove('dragging-active');
    document.body.style.userSelect = '';
    document.body.style.webkitUserSelect = '';
    productList.style.transition = 'transform 0.5s ease-out';
    const slideWidth = getProductSlideWidth();
    productList.style.transform = `translateX(${-currentProductSlide * slideWidth}px)`;
    startProductAutoScroll();
  }
}
  
  productList.addEventListener('mousedown', productDragStart);
  document.addEventListener('mousemove', (e) => {
    if (isProductDragging) productDrag(e);
  });
  document.addEventListener('mouseup', productDragEnd);
  document.addEventListener('mouseleave', forceProductDragEnd);
  
  productList.addEventListener('touchstart', productDragStart);
  document.addEventListener('touchmove', (e) => {
    if (isProductDragging) productDrag(e);
  });
  document.addEventListener('touchend', productDragEnd);
  document.addEventListener('touchcancel', forceProductDragEnd);
  
  window.addEventListener('blur', forceProductDragEnd);
  
  window.addEventListener('resize', () => {
    isProductDragBlocked = true;
    updateProductsPerView();
    const slideWidth = getProductSlideWidth();
    productList.style.transition = 'none';
    productList.style.transform = `translateX(${-currentProductSlide * slideWidth}px)`;
    void productList.offsetWidth;
    clearTimeout(window.productsResizeTimer);
    window.productsResizeTimer = setTimeout(() => {
      isProductDragBlocked = false;
      productList.style.transition = 'transform 0.5s ease-out';
      startProductAutoScroll();
    }, 250);
    setTimeout(() => {
      if (isProductDragBlocked) {
        isProductDragBlocked = false;
        startProductAutoScroll();
      }
    }, 2000);
  });

  let wasDragging = false;
  productList.addEventListener('click', (e) => {
    if (isProductDragging || wasDragging) {
      e.preventDefault();
      e.stopPropagation();
      setTimeout(() => {
        wasDragging = false;
      }, 50);
      return false;
    }
  });
  productList.addEventListener('mousedown', (e) => {
    wasDragging = false;
  });

  productList.addEventListener('mousemove', (e) => {
    if (isProductDragging) {
      wasDragging = true;
    }
  });

  document.addEventListener('mouseup', () => {
    if (wasDragging) {
      setTimeout(() => {
        wasDragging = false;
      }, 100);
    }
  });

  productList.removeEventListener('touchstart', productDragStart);
  document.removeEventListener('touchmove', (e) => {
    if (isProductDragging) productDrag(e);
  });
  document.removeEventListener('touchend', productDragEnd);
  document.removeEventListener('touchcancel', forceProductDragEnd);

  let touchStartTime = 0;
  let touchStartX = 0;
  let touchStartY = 0;
  let touchMoved = false;
  let potentialClick = false;

  productList.addEventListener('touchstart', (e) => {
    touchStartTime = Date.now();
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
    touchMoved = false;
    wasDragging = false;
    potentialClick = true;
    productStartX = e.touches[0].clientX;
    productLastDragPosition = productStartX;
    const transformValue = window.getComputedStyle(productList).transform;
    const matrix = new DOMMatrixReadOnly(transformValue);
    productStartTranslate = matrix.m41;
    clearInterval(productAutoPlayInterval);
  });

  document.addEventListener('touchmove', (e) => {
    const deltaX = Math.abs(e.touches[0].clientX - touchStartX);
    const deltaY = Math.abs(e.touches[0].clientY - touchStartY);
    if (deltaX > 10) {
      if (!touchMoved && potentialClick) {
        touchMoved = true;
        wasDragging = true;
        potentialClick = false;
        isProductDragging = true;
        productList.style.transition = 'none';
        document.body.classList.add('dragging-active');
      }
      if (isProductDragging) {
        e.preventDefault();
        const currentPosition = e.touches[0].clientX;
        productLastDragPosition = currentPosition;
        const diff = currentPosition - productStartX;
        productList.style.transform = `translateX(${productStartTranslate + diff}px)`;
      }
    } 
    else if (deltaY > 10) {
      potentialClick = false;
      touchMoved = true;
    }
  });

  document.addEventListener('touchend', (e) => {
    const touchEndTime = Date.now();
    const touchDuration = touchEndTime - touchStartTime;
    if (!touchMoved && touchDuration < 300 && potentialClick) {
      return;
    }
    if (isProductDragging) {
      e.preventDefault();
      isProductDragging = false;
      document.body.classList.remove('dragging-active');
      productList.style.transition = 'transform 0.5s ease-out';
      const diff = productLastDragPosition - productStartX;
      const slideWidth = getProductSlideWidth();
      if (Math.abs(diff) > slideWidth * 0.2) {
        if (diff > 0) {
          prevProductSlide();
        } else {
          nextProductSlide();
        }
      } else {
        productList.style.transform = `translateX(${-currentProductSlide * slideWidth}px)`;
      }
      setTimeout(() => {
        wasDragging = false;
        touchMoved = false;
        potentialClick = false;
      }, 150);
      startProductAutoScroll();
    }
  });

  document.addEventListener('touchcancel', () => {
    if (isProductDragging) {
      isProductDragging = false;
      document.body.classList.remove('dragging-active');
      productList.style.transition = 'transform 0.5s ease-out';
      const slideWidth = getProductSlideWidth();
      productList.style.transform = `translateX(${-currentProductSlide * slideWidth}px)`;
      startProductAutoScroll();
    }
    touchMoved = false;
    wasDragging = false;
    potentialClick = false;
  });

  if (productLeftButton) {
    productLeftButton.addEventListener('click', () => {
      prevProductSlide();
    });
  }
  
  if (productRightButton) {
    productRightButton.addEventListener('click', () => {
      nextProductSlide();
    });
  }
  
  setupProductInfiniteScroll();
  startProductAutoScroll();
}

  const reviewsList = document.getElementById('reviews-list');
  const reviewsIndicators = document.getElementById('reviews-indicators');
  
  if (reviewsList && reviewsIndicators) {
    const originalSlides = Array.from(reviewsList.querySelectorAll('li'));
    let slideCount = originalSlides.length;
    let currentSlide = 0;
    let autoPlayInterval = null;
    let isAnimating = false;
    let isDragBlocked = false;
    let slidesPerView = 1;
    
    function updateSlidesPerView() {
      const wasChanged = slidesPerView !== (window.matchMedia('(min-width: 992px)').matches ? 2 : 1);
      slidesPerView = window.matchMedia('(min-width: 992px)').matches ? 2 : 1;
      if (wasChanged) {
        adjustSlidesWidth();
      }
      return wasChanged;
    }
    
    function adjustSlidesWidth() {
      const allSlides = reviewsList.querySelectorAll('li');
      const slideWidth = 100 / slidesPerView;
      allSlides.forEach(slide => {
        slide.style.flex = `0 0 ${slideWidth}%`;
        slide.style.width = `${slideWidth}%`;
        slide.style.marginRight = '0';
        slide.style.boxSizing = 'border-box';
        slide.style.padding = '0 10px';
      });
      reviewsList.style.paddingLeft = '0';
      reviewsList.style.paddingRight = '0';
    }
    
    updateSlidesPerView();
    
    originalSlides.forEach((_, index) => {
      const indicator = document.createElement('div');
      indicator.classList.add('indicator');
      if (index === 0) indicator.classList.add('active');
      indicator.addEventListener('click', () => {
        if (!isAnimating && !isDragBlocked) {
          clearInterval(autoPlayInterval);
          goToSlide(index + slideCount);
          startAutoScroll();
        }
      });
      reviewsIndicators.appendChild(indicator);
    });
    
    function updateIndicators() {
      const normalizedIndex = (currentSlide % slideCount + slideCount) % slideCount;
      const indicators = reviewsIndicators.querySelectorAll('.indicator');
      indicators.forEach((indicator, index) => {
        if (index === normalizedIndex) {
          indicator.classList.add('active');
        } else {
          indicator.classList.remove('active');
        }
      });
    }
    
    function getSlideWidth() {
      const containerWidth = reviewsList.offsetWidth;
      return containerWidth / slidesPerView;
    }
    
    function goToSlide(index) {
      if (isAnimating) return;
      isAnimating = true;
      currentSlide = index;
      const slideWidth = getSlideWidth();
      reviewsList.style.transition = 'transform 0.5s ease-out';
      reviewsList.style.transform = `translateX(${-currentSlide * slideWidth}px)`;
      updateIndicators();
    }
    
    function nextSlide() {
      if (isAnimating || isDragBlocked) return;
      goToSlide(currentSlide + 1);
    }
    
    function prevSlide() {
      if (isAnimating || isDragBlocked) return;
      goToSlide(currentSlide - 1);
    }
    
    function startAutoScroll() {
      if (autoPlayInterval) {
        clearInterval(autoPlayInterval);
      }
      autoPlayInterval = setInterval(() => {
        if (!isAnimating && !isDragBlocked) {
          nextSlide();
        }
      }, 2000);
    }
    
    function setupInfiniteScroll() {
      const beforeClones = [];
      const afterClones = [];
      originalSlides.forEach((slide) => {
        const beforeClone = slide.cloneNode(true);
        beforeClone.classList.add('cloned-slide');
        beforeClone.setAttribute('aria-hidden', 'true');
        beforeClones.push(beforeClone);
        const afterClone = slide.cloneNode(true);
        afterClone.classList.add('cloned-slide');
        afterClone.setAttribute('aria-hidden', 'true');
        afterClones.push(afterClone);
      });
      beforeClones.reverse().forEach(clone => {
        reviewsList.insertBefore(clone, reviewsList.firstChild);
      });
      afterClones.forEach(clone => {
        reviewsList.appendChild(clone);
      });
      adjustSlidesWidth();
      currentSlide = slideCount;
      const slideWidth = getSlideWidth();
      reviewsList.style.transition = 'none';
      reviewsList.style.transform = `translateX(${-currentSlide * slideWidth}px)`;
      void reviewsList.offsetWidth;
      reviewsList.style.transition = 'transform 0.5s ease-out';
    }
    
    function forceUnblockCarousel() {
      isDragBlocked = false;
      isAnimating = false;
      startAutoScroll();
    }
    
    setTimeout(forceUnblockCarousel, 3000);
    
    reviewsList.addEventListener('transitionend', function(e) {
      if (e.propertyName !== 'transform' || !isAnimating) return;
      const totalSlides = reviewsList.children.length;
      const slideWidth = getSlideWidth();
      if (currentSlide <= slideCount - 1) {
        reviewsList.style.transition = 'none';
        currentSlide = currentSlide + slideCount;
        reviewsList.style.transform = `translateX(${-currentSlide * slideWidth}px)`;
      } else if (currentSlide >= totalSlides - slideCount) {
        reviewsList.style.transition = 'none';
        currentSlide = currentSlide - slideCount;
        reviewsList.style.transform = `translateX(${-currentSlide * slideWidth}px)`;
      }
      void reviewsList.offsetWidth;
      reviewsList.style.transition = 'transform 0.5s ease-out';
      isAnimating = false;
    });
    
    let isDragging = false;
    let startX = 0;
    let startTranslate = 0;
    let lastDragPosition = 0;
    
    function getPositionX(event) {
      return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
    }
    
    function dragStart(e) {
      if (isAnimating || isDragBlocked) return;
      startX = getPositionX(e);
      lastDragPosition = startX;
      isDragging = true;
      const transformValue = window.getComputedStyle(reviewsList).transform;
      const matrix = new DOMMatrixReadOnly(transformValue);
      startTranslate = matrix.m41;
      clearInterval(autoPlayInterval);
      reviewsList.style.transition = 'none';
      if (e.type === 'mousedown') {
        reviewsList.style.cursor = 'grabbing';
      }
      document.body.classList.add('dragging-active');
    }
    
    function drag(e) {
      if (!isDragging) return;
      e.preventDefault();
      const currentPosition = getPositionX(e);
      lastDragPosition = currentPosition;
      const diff = currentPosition - startX;
      reviewsList.style.transform = `translateX(${startTranslate + diff}px)`;
    }
    
    function dragEnd() {
      if (!isDragging) return;
      isDragging = false;
      reviewsList.style.cursor = '';
      document.body.classList.remove('dragging-active');
      reviewsList.style.transition = 'transform 0.5s ease-out';
      const diff = lastDragPosition - startX;
      const slideWidth = getSlideWidth();
      if (Math.abs(diff) > slideWidth * 0.2) {
        if (diff > 0) {
          prevSlide();
        } else {
          nextSlide();
        }
      } else {
        reviewsList.style.transform = `translateX(${-currentSlide * slideWidth}px)`;
      }
      startAutoScroll();
    }
    
    function forceDragEnd() {
      if (isDragging) {
        isDragging = false;
        reviewsList.style.cursor = '';
        document.body.classList.remove('dragging-active');
        reviewsList.style.transition = 'transform 0.5s ease-out';
        const slideWidth = getSlideWidth();
        reviewsList.style.transform = `translateX(${-currentSlide * slideWidth}px)`;
        startAutoScroll();
      }
    }
    
    reviewsList.addEventListener('mousedown', dragStart);
    document.addEventListener('mousemove', (e) => {
      if (isDragging) drag(e);
    });
    document.addEventListener('mouseup', dragEnd);
    document.addEventListener('mouseleave', forceDragEnd);
    reviewsList.addEventListener('touchstart', dragStart);
    document.addEventListener('touchmove', (e) => {
      if (isDragging) drag(e);
    });
    document.addEventListener('touchend', dragEnd);
    document.addEventListener('touchcancel', forceDragEnd);
    window.addEventListener('blur', forceDragEnd);
    reviewsList.style.display = 'flex';
    reviewsList.style.overflow = 'visible';
    window.addEventListener('resize', () => {
      isDragBlocked = true;
      const wasChanged = updateSlidesPerView();
      const slideWidth = getSlideWidth();
      reviewsList.style.transition = 'none';
      reviewsList.style.transform = `translateX(${-currentSlide * slideWidth}px)`;
      clearTimeout(window.resizeTimer);
      window.resizeTimer = setTimeout(() => {
        isDragBlocked = false;
        startAutoScroll();
        void reviewsList.offsetWidth;
        reviewsList.style.transition = 'transform 0.5s ease-out';
      }, 250);
      setTimeout(() => {
        if (isDragBlocked) {
          isDragBlocked = false;
          startAutoScroll();
        }
      }, 2000);
    });
    const rightButton = document.getElementById('reviews-right-button');
    const leftButton = document.getElementById('reviews-left-button');
    if (rightButton) {
      rightButton.addEventListener('click', () => {
        nextSlide();
      });
    }
    if (leftButton) {
      leftButton.addEventListener('click', () => {
        prevSlide();
      });
    }
    const toTopBtn = document.getElementById('get-to-beggining-button');
    if (toTopBtn) {
      toTopBtn.addEventListener('click', function(e) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
    setupInfiniteScroll();
    startAutoScroll();
  }
});