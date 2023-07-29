// Função para calcular a contagem regressiva
function countdown(targetDate) {
    const now = new Date().getTime();
    const timeLeft = targetDate - now;
  
    // Cálculos para obter o número de dias, horas, minutos e segundos restantes
    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
  
    // Atualiza o elemento de contagem regressiva no DOM
    const countdownElement = document.getElementById("countdown");
    countdownElement.textContent = `Faltam ${days} dias e ${hours} horas para o lançamento`;
    //countdownElement.textContent = `Faltam ${days} dias, ${hours} horas, ${minutes} minutos e ${seconds} segundos para o lançamento`;
  }
  
  // Defina a data e hora do lançamento
  const launchDate = new Date("2023-09-05T00:00:00").getTime();
  
  // Inicie a contagem regressiva
  countdown(launchDate);
  
  const backgroundList = [
    'star1.jpg',
    'star2.jpg',
    'star3.jpg',
    'star4.jpg',
    'star5.jpg',
    'star6.webp',
    'star7.webp',
    'star8.jpg',
    'star9.jpg',
    'star10.jpg',
    'star11.jpg',
    'star12.webp',
    'star13.webp',
    'star14.webp',
    'star15.jpg',
    'star16.webp',
    'star17.jpg'

    // Adicione aqui outras imagens de background que deseja usar
  ];
  
  let currentBackgroundIndex = getRandomBackgroundIndex();

  function getRandomBackgroundIndex() {
    return Math.floor(Math.random() * backgroundList.length);
  }
  
  function changeBackground() {
    const body = document.body;
    body.style.backgroundImage = `url('img/${backgroundList[currentBackgroundIndex]}')`;
  
    getRandomBackgroundIndex();
  }

  changeBackground()
  
  // Chame a função para trocar o background a cada 60 segundos (60.000 ms)
  setInterval(changeBackground, 30000);  