document.addEventListener('DOMContentLoaded', function() {
  const orderButton = document.getElementById('order-button');
  const modalOverlay = document.getElementById('modal-overlay');
  const modalClose = document.getElementById('modal-close');
  const orderForm = document.getElementById('order-form');
  const formSuccess = document.getElementById('form-success');
  
  if (orderButton) {
    orderButton.addEventListener('click', function() {
      modalOverlay.style.display = 'flex';
      document.body.style.overflow = 'hidden'; // Предотвращаем прокрутку фона
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
  if (orderForm) {
    orderForm.addEventListener('submit', function(event) {
      event.preventDefault();
      
      const formData = new FormData(orderForm);
      const submitBtn = orderForm.querySelector('.submit-button');
      
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Отправка...';
      }
      fetch('sendmail.php', {
        method: 'POST',
        body: formData
      })
      .then(response => {
        return response.json().catch(() => {

          throw new Error('Некорректный ответ сервера');
        });
      })
      .then(data => {
        if (data.success) {
          orderForm.style.display = 'none';
          formSuccess.style.display = 'block';
          orderForm.reset();
        } else {
          throw new Error(data.error || 'Неизвестная ошибка');
        }
      })
      .catch(error => {
        alert('Произошла ошибка при отправке формы: ' + error.message);
      })
      .finally(() => {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = 'Отправить';
        }
      });
    });
  } else {
    console.error('Форма не найдена на странице');
  }

    const reviewsList = document.getElementById('reviews-list');
  const reviewsIndicators = document.getElementById('reviews-indicators');
  
  if (reviewsList && reviewsIndicators) {
    const slides = reviewsList.querySelectorAll('li');
    let currentSlide = 0;
    let autoPlayInterval;
    
    slides.forEach((_, index) => {
      const indicator = document.createElement('div');
      indicator.classList.add('indicator');
      if (index === 0) indicator.classList.add('active');
      indicator.addEventListener('click', () => goToSlide(index));
      reviewsIndicators.appendChild(indicator);
    });
    
    function updateIndicators() {
      const indicators = reviewsIndicators.querySelectorAll('.indicator');
      indicators.forEach((indicator, index) => {
        if (index === currentSlide) {
          indicator.classList.add('active');
        } else {
          indicator.classList.remove('active');
        }
      });
    }
    
    function goToSlide(index) {
      if (index < 0) {
        currentSlide = slides.length - 1;
      } else if (index >= slides.length) {
        currentSlide = 0;
      } else {
        currentSlide = index;
      }
      
      const offset = slides[0].offsetWidth + parseInt(getComputedStyle(slides[0]).marginRight);
      reviewsList.scrollTo({
        left: currentSlide * offset,
        behavior: 'smooth'
      });
      
      updateIndicators();
    }
    
    function nextSlide() {
      goToSlide(currentSlide + 1);
    }
    
    function startAutoScroll() {
      autoPlayInterval = setInterval(nextSlide, 3000);
    }
    
    reviewsList.addEventListener('mousedown', () => {
      clearInterval(autoPlayInterval);
    });
    
    reviewsList.addEventListener('touchstart', () => {
      clearInterval(autoPlayInterval);
    });
    
    reviewsList.addEventListener('mouseup', () => {
      startAutoScroll();
    });
    
    reviewsList.addEventListener('touchend', () => {
      startAutoScroll();
    });
    
    startAutoScroll();
  }
  
  if (orderButton) {
    orderButton.addEventListener('click', function() {
      modalOverlay.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    });
  }
  
});