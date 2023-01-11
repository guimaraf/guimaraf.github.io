const shutDownButton = document.getElementById("shutdown-button");
const stopButton = document.getElementById("stop-button");
let shutDownTime = document.getElementById("shutdown-time").value;
let timerDisplay = document.getElementById("timer");
let intervalId;

//verifica se o navegador tem permissão para desligar o pc
document.addEventListener("DOMContentLoaded", function() {
    if (!("Notification" in window)) {
      alert("Desculpe, seu navegador não suporta esta função.");
    } else if (Notification.permission === "granted") {
      // Permissão já foi concedida
      // Iniciar o contador e habilitar os botões
    } else if (Notification.permission !== "denied") {
      // Perguntar permissão
      Notification.requestPermission().then(function (permission) {
        if (permission === "granted") {
          // Iniciar o contador e habilitar os botões
        }
      });
    }
  });

// Iniciar o contador com o tempo equivalente a 1 hora
document.getElementById("shutdown-time").value = 10;
//shutDownTime = shutDownTime * 60 * 1000; // Converter horas para milisegundos
//let countDownDate = new Date().getTime() + shutDownTime;

shutDownButton.addEventListener("click", function() {
    shutDownTime = document.getElementById("shutdown-time").value;
    shutDownTime = shutDownTime * 60 * 1000; // Converter minutos para milisegundos
    let countDownDate = new Date().getTime() + shutDownTime; // Obtém a data/hora atual e soma o tempo de desligamento
    // Desabilitar o botão iniciar e habilitar o botão parar
    shutDownButton.disabled = true;
    stopButton.disabled = false;
    intervalId = setInterval(() => shutDownTimer(countDownDate), 1000);
});

stopButton.addEventListener("click", function() {
    // Limpar o intervalo, zerar o contador e habilitar o botão iniciar e desabilitar o botão parar
    clearInterval(intervalId);
    timerDisplay.innerHTML = "Tempo restante: 0 horas, 0 minutos e 0 segundos";
    shutDownButton.disabled = false;
    stopButton.disabled = true;
});

function shutDownTimer(countDownDate) {
    let now = new Date().getTime();
    let distance = countDownDate - now;
    
    if (distance < 0) {
        // Se o tempo de desligamento já passou, desligue o computador
        shutDown();
        return;
    }
    let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((distance % (1000 * 60)) / 1000);
    let timeFormat = `Tempo restante: ${hours} horas, ${minutes} minutos e ${seconds} segundos`;
    timerDisplay.innerHTML = timeFormat;
    console.log(timeFormat);
}

function shutDown() {
    // aqui coloque o código para desligar o computador de acordo com o sistema operacional que você está usando
    if (navigator.appVersion.indexOf("Win") != -1) {
        // Código para desligar o computador em sistemas Windows
        require('child_process').exec('shutdown /s /t 0');
    } else if (navigator.appVersion.indexOf("Mac") != -1) {
        // Código para desligar o computador em sistemas macOS
        require('child_process').exec('shutdown -h now');
    } else if (navigator.appVersion.indexOf("X11") != -1) {
        // Código para desligar o computador em sistemas Linux/Unix
        require('child_process').exec('shutdown -h now');
    } else if (navigator.appVersion.indexOf("Linux") != -1) {
        // Código para desligar o computador em sistemas Linux
        require('child_process').exec('shutdown -h now');
    } else {
        console.log('Sistema operacional não suportado.');
    }
}