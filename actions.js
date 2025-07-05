document.addEventListener('DOMContentLoaded', function() {
  const orderButton = document.getElementById('order-button');
  const modalOverlay = document.getElementsByClassName('modal-overlay');
  const modalClose = document.getElementsByClassName('modal-close');
  const orderForm = document.getElementsByClassName('order-form');
  const formSuccess = document.getElementsByClassName('form-success');
  
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
});