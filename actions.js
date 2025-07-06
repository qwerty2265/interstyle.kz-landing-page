document.addEventListener('DOMContentLoaded', function() {
  const orderButton = document.getElementById('order-button');
  const modalOverlay = document.getElementById('modal-overlay');
  const modalClose = document.getElementById('modal-close');
  const orderForm = document.getElementById('order-form');
  const formSuccess = document.getElementById('form-success');
  
  // Modal functionality
  if (orderButton) {
    orderButton.addEventListener('click', function() {
      modalOverlay.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    });
  }
  
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
  
  // Form submission
  if (orderForm) {
    orderForm.addEventListener('submit', function(event) {
      event.preventDefault();
      
      const formData = new FormData(orderForm);
      const name = formData.get('name');
      const phone = formData.get('phone');
      const callTime = formData.get('call-time');
      
      console.log(`Заказ: ${name}, ${phone}, ${callTime}`);
      
      orderForm.style.display = 'none';
      formSuccess.style.display = 'block';
    });
  }

  // Reviews slider functionality
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
    
    // Принудительно применяем стиль для скрытия нежелательного содержимого
    const reviewsContainer = document.querySelector('.reviews-container');
    if (reviewsContainer) {
      reviewsContainer.style.overflow = 'hidden';
    }
    
    // Устанавливаем slidesPerView в зависимости от ширины экрана
    function updateSlidesPerView() {
      const wasChanged = slidesPerView !== (window.matchMedia('(min-width: 992px)').matches ? 2 : 1);
      slidesPerView = window.matchMedia('(min-width: 992px)').matches ? 2 : 1;
      
      // Обновляем стили слайдов для адаптивного отображения
      if (wasChanged) {
        adjustSlidesWidth();
      }
      
      return wasChanged;
    }
    
    // Обновляем ширину слайдов в соответствии с slidesPerView
    function adjustSlidesWidth() {
      const allSlides = reviewsList.querySelectorAll('li');
      const slideWidth = 100 / slidesPerView;
      
      // Устанавливаем точную ширину для каждого слайда
      allSlides.forEach(slide => {
        slide.style.flex = `0 0 ${slideWidth}%`;
        slide.style.width = `${slideWidth}%`;
        
        // Убираем margin-right и добавляем padding для контроля межэлементного пространства
        slide.style.marginRight = '0';
        slide.style.boxSizing = 'border-box';
        slide.style.padding = '0 10px';
      });
      
      // Добавляем отступы к контейнеру для лучшего центрирования
      reviewsList.style.paddingLeft = '0';
      reviewsList.style.paddingRight = '0';
    }
    
    // Первоначальная настройка
    updateSlidesPerView();
    
    // Создаем индикаторы
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
      // Учитываем slidesPerView при обновлении индикаторов
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
      // Получаем полную ширину контейнера
      const containerWidth = reviewsList.offsetWidth;
      
      // Возвращаем ширину одного слайда
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
      // Копируем слайды для начала и конца
      const beforeClones = [];
      const afterClones = [];
      
      // Создаем клоны для начала и конца
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
      
      // Добавляем клоны в DOM
      beforeClones.reverse().forEach(clone => {
        reviewsList.insertBefore(clone, reviewsList.firstChild);
      });
      
      afterClones.forEach(clone => {
        reviewsList.appendChild(clone);
      });
      
      // Установка правильных размеров для всех слайдов
      adjustSlidesWidth();
      
      // Устанавливаем начальную позицию на первый оригинальный слайд
      currentSlide = slideCount;
      
      const slideWidth = getSlideWidth();
      reviewsList.style.transition = 'none';
      reviewsList.style.transform = `translateX(${-currentSlide * slideWidth}px)`;
      
      // Принудительный reflow
      void reviewsList.offsetWidth;
      
      // Восстанавливаем анимацию
      reviewsList.style.transition = 'transform 0.5s ease-out';
    }
    
    // Функция для принудительной разблокировки карусели
    function forceUnblockCarousel() {
      isDragBlocked = false;
      isAnimating = false;
      startAutoScroll();
      console.log('Carousel forcibly unblocked');
    }
    
    // Вызываем через 3 секунды после загрузки страницы
    setTimeout(forceUnblockCarousel, 3000);
    
    // Обработчик окончания перехода для бесконечной карусели
    reviewsList.addEventListener('transitionend', function(e) {
      if (e.propertyName !== 'transform' || !isAnimating) return;
      
      const totalSlides = reviewsList.children.length;
      const slideWidth = getSlideWidth();
      
      // Проверяем, нужно ли перепрыгнуть
      if (currentSlide <= slideCount - 1) {
        // Перепрыгиваем с начальных клонов на оригинальные с конца
        reviewsList.style.transition = 'none';
        currentSlide = currentSlide + slideCount;
        reviewsList.style.transform = `translateX(${-currentSlide * slideWidth}px)`;
      } else if (currentSlide >= totalSlides - slideCount) {
        // Перепрыгиваем с конечных клонов на оригинальные с начала
        reviewsList.style.transition = 'none';
        currentSlide = currentSlide - slideCount;
        reviewsList.style.transform = `translateX(${-currentSlide * slideWidth}px)`;
      }
      
      // Принудительный reflow
      void reviewsList.offsetWidth;
      
      // Восстанавливаем анимацию для следующего перехода
      reviewsList.style.transition = 'transform 0.5s ease-out';
      
      // Снимаем флаг анимации
      isAnimating = false;
    });
    
    // Drag functionality
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
      
      // Определяем направление и величину свайпа
      if (Math.abs(diff) > slideWidth * 0.2) {
        if (diff > 0) {
          prevSlide();
        } else {
          nextSlide();
        }
      } else {
        // Возвращаемся к текущему слайду
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
    
    // События для desktop
    reviewsList.addEventListener('mousedown', dragStart);
    document.addEventListener('mousemove', (e) => {
      if (isDragging) drag(e);
    });
    document.addEventListener('mouseup', dragEnd);
    document.addEventListener('mouseleave', forceDragEnd);
    
    // События для mobile
    reviewsList.addEventListener('touchstart', dragStart);
    document.addEventListener('touchmove', (e) => {
      if (isDragging) drag(e);
    });
    document.addEventListener('touchend', dragEnd);
    document.addEventListener('touchcancel', forceDragEnd);
    
    window.addEventListener('blur', forceDragEnd);
    
    // Базовые стили для карусели
    reviewsList.style.display = 'flex';
    reviewsList.style.overflow = 'visible';
    
    // Обработка изменения размера окна
    window.addEventListener('resize', () => {
      isDragBlocked = true;
      
      // Обновляем количество видимых слайдов
      const wasChanged = updateSlidesPerView();
      
      // Пересчитываем позицию слайдера
      const slideWidth = getSlideWidth();
      reviewsList.style.transition = 'none';
      reviewsList.style.transform = `translateX(${-currentSlide * slideWidth}px)`;
      
      // Разблокируем через небольшое время
      clearTimeout(window.resizeTimer);
      window.resizeTimer = setTimeout(() => {
        isDragBlocked = false;
        
        // Перезапускаем автопрокрутку когда разблокируем
        startAutoScroll();
        
        // Принудительный reflow
        void reviewsList.offsetWidth;
        
        // Восстанавливаем анимацию
        reviewsList.style.transition = 'transform 0.5s ease-out';
      }, 250);
      
      // Аварийный сброс блокировки через 2 секунды
      setTimeout(() => {
        if (isDragBlocked) {
          console.log('Emergency unblock of carousel');
          isDragBlocked = false;
          startAutoScroll();
        }
      }, 2000);
    });

    const rightButton = document.getElementById('reviews-right-button');
    const leftButton = document.getElementById('reviews-left-button');

    // Обработчики кнопок навигации
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
    
    // Инициализация и запуск карусели
    setupInfiniteScroll();
    startAutoScroll();
  }
});