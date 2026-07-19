const expressionEl = document.getElementById("expression");
const resultEl = document.getElementById("result");
const buttons = document.querySelectorAll(".btn");

let expression = "0";
let justEvaluated = false;

function updateDisplay() {
  expressionEl.textContent = expression;
}

function isOperator(char) {
  return ["+", "-", "*", "/"].includes(char);
}

function getCurrentNumber() {
  const parts = expression.split(/[+\-*/]/);
  return parts[parts.length - 1];
}

function appendValue(value) {
  if (justEvaluated) {
    expression = "0";
    justEvaluated = false;
  }

  if (value === ".") {
    const currentNumber = getCurrentNumber();
    if (currentNumber.includes(".")) {
      return;
    }
  }

  if (expression === "0" && ![".", "+", "-", "*", "/"].includes(value)) {
    expression = value;
  } else if (isOperator(value)) {
    const lastChar = expression.slice(-1);
    if (expression === "0" && value === "-") {
      expression = "-";
    } else if (isOperator(lastChar)) {
      expression = expression.slice(0, -1) + value;
    } else {
      expression += value;
    }
  } else {
    expression += value;
  }

  updateDisplay();
  resultEl.textContent = "";
}

function deleteLast() {
  if (expression.length <= 1) {
    expression = "0";
  } else {
    expression = expression.slice(0, -1);
  }

  updateDisplay();
  resultEl.textContent = "";
}

function clearDisplay() {
  expression = "0";
  resultEl.textContent = "";
  updateDisplay();
}

function calculate() {
  const sanitized = expression.replace(/[^0-9+\-*/().\s]/g, "");

  if (!sanitized || /[+\-*/.]$/.test(sanitized)) {
    resultEl.textContent = "Error";
    return;
  }

  try {
    const result = Function(`"use strict"; return (${sanitized})`)();
    if (!Number.isFinite(result)) {
      throw new Error("Invalid calculation");
    }

    expression = String(result);
    resultEl.textContent = expression;
    justEvaluated = true;
    updateDisplay();
  } catch (error) {
    resultEl.textContent = "Error";
  }
}

buttons.forEach((button) => {
  button.addEventListener("click", () => {
    const value = button.dataset.value;
    const action = button.dataset.action;

    if (action === "clear") {
      clearDisplay();
    } else if (action === "delete") {
      deleteLast();
    } else if (action === "equals") {
      calculate();
    } else if (value) {
      appendValue(value);
    }
  });
});

document.addEventListener("keydown", (event) => {
  const key = event.key;

  if (/\d/.test(key)) {
    appendValue(key);
    event.preventDefault();
  } else if (["+", "-", "*", "/", "."].includes(key)) {
    appendValue(key);
    event.preventDefault();
  } else if (key === "Enter") {
    calculate();
    event.preventDefault();
  } else if (key === "Backspace") {
    deleteLast();
    event.preventDefault();
  } else if (key === "Delete" || key === "Escape") {
    clearDisplay();
    event.preventDefault();
  }
});

updateDisplay();
