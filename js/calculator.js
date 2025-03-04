document.addEventListener('DOMContentLoaded', function() {
    const currentValueElement = document.querySelector('.current-value');
    const historyElement = document.querySelector('.calculation-history');
    const numberButtons = document.querySelectorAll('.btn.number');
    const operatorButtons = document.querySelectorAll('.btn.operator');
    const equalsButton = document.querySelector('.btn.equals');
    const clearButton = document.querySelector('.btn.clear');
    const backspaceButton = document.querySelector('.btn.backspace');
    const decimalButton = document.querySelector('.btn.decimal');
    
    let currentValue = '0';
    let previousValue = '';
    let operation = '';
    let shouldResetDisplay = false;
    
    // Atualiza o display da calculadora
    function updateDisplay() {
      currentValueElement.textContent = currentValue;
      
      if (previousValue && operation) {
        historyElement.textContent = `${previousValue} ${getOperationSymbol(operation)}`;
      } else {
        historyElement.textContent = '';
      }
    }
    
    // Retorna o símbolo correto para a operação
    function getOperationSymbol(op) {
      switch(op) {
        case 'add': return '+';
        case 'subtract': return '-';
        case 'multiply': return '×';
        case 'divide': return '÷';
        case 'percent': return '%';
        default: return '';
      }
    }
    
    // Adiciona um número ao display
    function appendNumber(number) {
      if (currentValue === '0' || shouldResetDisplay) {
        currentValue = number;
        shouldResetDisplay = false;
      } else {
        currentValue += number;
      }
      updateDisplay();
    }
    
    // Adiciona um ponto decimal
    function appendDecimal() {
      if (shouldResetDisplay) {
        currentValue = '0.';
        shouldResetDisplay = false;
      } else if (!currentValue.includes('.')) {
        currentValue += '.';
      }
      updateDisplay();
    }
    
    // Limpa a calculadora
    function clearCalculator() {
      currentValue = '0';
      previousValue = '';
      operation = '';
      shouldResetDisplay = false;
      updateDisplay();
    }
    
    // Remove o último dígito
    function backspace() {
      if (shouldResetDisplay) {
        currentValue = '0';
        shouldResetDisplay = false;
      } else if (currentValue.length === 1) {
        currentValue = '0';
      } else {
        currentValue = currentValue.slice(0, -1);
      }
      updateDisplay();
    }
    
    // Seleciona uma operação
    function selectOperation(op) {
      if (currentValue === '') return;
      
      if (previousValue !== '') {
        calculate();
      }
      
      operation = op;
      previousValue = currentValue;
      shouldResetDisplay = true;
      updateDisplay();
    }
    
    // Realiza o cálculo
    function calculate() {
      if (!operation || !previousValue) return;
      
      let result;
      const prev = parseFloat(previousValue);
      const current = parseFloat(currentValue);
      
      switch(operation) {
        case 'add':
          result = prev + current;
          break;
        case 'subtract':
          result = prev - current;
          break;
        case 'multiply':
          result = prev * current;
          break;
        case 'divide':
          result = prev / current;
          break;
        case 'percent':
          result = prev % current;
          break;
        default:
          return;
      }
      
      currentValue = result.toString();
      operation = '';
      previousValue = '';
      shouldResetDisplay = true;
      updateDisplay();
    }
    
    // Event listeners para os botões numéricos
    numberButtons.forEach(button => {
      button.addEventListener('click', () => {
        appendNumber(button.textContent.trim());
      });
    });
    
    // Event listeners para os botões de operação
    operatorButtons.forEach(button => {
      button.addEventListener('click', () => {
        let op = '';
        if (button.classList.contains('add')) op = 'add';
        if (button.classList.contains('subtract')) op = 'subtract';
        if (button.classList.contains('multiply')) op = 'multiply';
        if (button.classList.contains('divide')) op = 'divide';
        if (button.classList.contains('percent')) op = 'percent';
        selectOperation(op);
      });
    });
    
    // Event listener para o botão de igual
    equalsButton.addEventListener('click', calculate);
    
    // Event listener para o botão de limpar
    clearButton.addEventListener('click', clearCalculator);
    
    // Event listener para o botão de backspace
    backspaceButton.addEventListener('click', backspace);
    
    // Event listener para o botão decimal
    decimalButton.addEventListener('click', appendDecimal);
    
    // Event listeners para o teclado
    document.addEventListener('keydown', (event) => {
      if (/[0-9]/.test(event.key)) {
        appendNumber(event.key);
      } else if (event.key === '.') {
        appendDecimal();
      } else if (event.key === '+') {
        selectOperation('add');
      } else if (event.key === '-') {
        selectOperation('subtract');
      } else if (event.key === '*') {
        selectOperation('multiply');
      } else if (event.key === '/') {
        event.preventDefault();
        selectOperation('divide');
      } else if (event.key === '%') {
        selectOperation('percent');
      } else if (event.key === 'Enter' || event.key === '=') {
        calculate();
      } else if (event.key === 'Escape') {
        clearCalculator();
      } else if (event.key === 'Backspace') {
        backspace();
      }
    });
    
    // Inicializa o display
    updateDisplay();
  });