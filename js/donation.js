document.addEventListener('DOMContentLoaded', function() {
  // Elementos do formulário
  const donationForm = document.getElementById('donationFormElement');
  const phoneInput = document.getElementById('phone');
  const amountInput = document.getElementById('amount');
  const donateBtn = document.querySelector('.donate-btn');
  
  // Elementos do modal
  const confirmationModal = document.getElementById('confirmationModal');
  const confirmAmountSpan = document.getElementById('confirmAmount');
  
  // Elementos da tela de sucesso
  const successScreen = document.getElementById('successScreen');
  const successAmountSpan = document.getElementById('successAmount');
  const donationDateSpan = document.getElementById('donationDate');
  
  // Máscara para telefone
  phoneInput.addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    
    if (value.length > 0) {
      value = '+' + value;
      if (value.length > 3) {
        value = value.substring(0, 3) + ' ' + value.substring(3);
      }
      if (value.length > 7) {
        value = value.substring(0, 7) + ' ' + value.substring(7);
      }
      if (value.length > 10) {
        value = value.substring(0, 10) + ' ' + value.substring(10);
      }
    }
    
    e.target.value = value;
  });
  
  // Validação do formulário e submissão
  donateBtn.addEventListener('click', function(e) {
    e.preventDefault();
    showConfirmation();
  });
  
  // Mostrar modal de confirmação
  function showConfirmation() {
    const phone = phoneInput.value.trim();
    const amount = amountInput.value.trim();
    
    if (!phone || !amount) {
      showError('Por favor, preencha todos os campos.');
      return;
    }
    
    if (parseInt(amount) < 100) {
      showError('O valor mínimo para doação é de 100 MT.');
      return;
    }
    
    confirmAmountSpan.textContent = amount;
    confirmationModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }
  
  // Fechar modal
  function closeConfirmation() {
    confirmationModal.style.display = 'none';
    document.body.style.overflow = 'auto';
  }
  
  // Processar doação
  function processDonation() {
    const amount = amountInput.value.trim();
    const phone = phoneInput.value.trim();
    
    // Adicionar feedback visual no botão
    donateBtn.disabled = true;
    donateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processando...';
    
    // Simulação de processamento mais realista
    setTimeout(() => {
      closeConfirmation();
      showSuccessScreen(amount);
      
      // Resetar botão após processamento
      setTimeout(() => {
        donateBtn.disabled = false;
        donateBtn.innerHTML = '<i class="fas fa-heart"></i> Doar Agora';
      }, 2000);
    }, 3000);
  }
  
  // Mostrar tela de sucesso
  function showSuccessScreen(amount) {
    document.getElementById('donationForm').style.display = 'none';
    
    successAmountSpan.textContent = amount;
    donationDateSpan.textContent = new Date().toLocaleDateString('pt-BR');
    successScreen.style.display = 'flex';
    
    // Efeito de confetti melhorado
    confetti({
      particleCount: 200,
      spread: 100,
      origin: { y: 0.6 },
      colors: ['#28a745', '#218838', '#ffffff']
    });
    
    setTimeout(() => {
      confetti({
        particleCount: 150,
        angle: 60,
        spread: 80,
        origin: { x: 0, y: 0.6 },
        colors: ['#28a745']
      });
      
      confetti({
        particleCount: 150,
        angle: 120,
        spread: 80,
        origin: { x: 1, y: 0.6 },
        colors: ['#218838']
      });
    }, 300);
  }
  
  // Voltar ao formulário
  function backToForm() {
    successScreen.style.display = 'none';
    document.getElementById('donationForm').style.display = 'flex';
    phoneInput.value = '';
    amountInput.value = '';
    phoneInput.focus();
  }
  
  // Mostrar mensagem de erro
  function showError(message) {
    const errorEl = document.createElement('div');
    errorEl.className = 'error-message';
    errorEl.textContent = message;
    
    const form = document.getElementById('donationForm');
    const existingError = form.querySelector('.error-message');
    
    if (existingError) {
      form.removeChild(existingError);
    }
    
    form.insertBefore(errorEl, donationForm.firstChild);
    
    // Adicionar animação de shake no formulário
    form.style.animation = 'shake 0.5s';
    setTimeout(() => {
      form.style.animation = '';
    }, 500);
    
    setTimeout(() => {
      if (errorEl.parentNode === form) {
        form.removeChild(errorEl);
      }
    }, 5000);
  }
  
  // Fechar modal ao clicar fora
  confirmationModal.addEventListener('click', function(e) {
    if (e.target === confirmationModal) {
      closeConfirmation();
    }
  });
  
  // Adicionar animação de shake para erros
  const style = document.createElement('style');
  style.textContent = `
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
      20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
  `;
  document.head.appendChild(style);
});