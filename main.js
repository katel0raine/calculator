const display = document.getElementById("display");
const numberButtons = document.querySelectorAll(".number");
const operatorButtons = document.querySelectorAll(".operator");
const clearAllButton = document.getElementById("clear-all");
const clearButton = document.getElementById("clear");
const backspaceButton = document.getElementById("backspace");
const positiveNegativeButton = document.getElementById("positive-negative");
const decimalButton = document.getElementById("decimal");
const equalsButton = document.getElementById("equals");

let displayValue = "0";
let pendingValue;
let operator;

numberButtons.forEach(number => number.addEventListener("click", getOperands));
operatorButtons.forEach(operator => operator.addEventListener("click", getNewOperator));
clearAllButton.addEventListener("click", clearAll);
clearButton.addEventListener("click", clear);
backspaceButton.addEventListener("click", backspace);
positiveNegativeButton.addEventListener("click", togglePositiveNegative);
decimalButton.addEventListener("click", addDecimal);
equalsButton.addEventListener("click", solve);

// limit display to 14 characters; after that, show exponential notation
function limitCharacters(rawNumber) {
  if (rawNumber.toString().length <= 14) {
    return rawNumber;
  }
  else {
    return Number.parseFloat(rawNumber).toExponential(5);
  }
}

function solve() {
  // if you click equals, solve the problem only if you have both operands and an operator
  if ((pendingValue != undefined) && (operator != undefined) && (displayValue != undefined)) {
    let solution = operate(pendingValue, operator, displayValue);
    displayValue = solution;
    pendingValue = undefined;
    operator = undefined;
    display.innerText = limitCharacters(displayValue);
  }
}

function getOperands(clickedNumbers) {
  let number = clickedNumbers.target.innerText;
  // removes leading 0 or "undefined" when entering numbers
  if ((displayValue == 0) || (displayValue === undefined)) {
    displayValue = "";
  }
  // remove leading 0 when toggling positive/negative before entering numbers
  if (displayValue === "-0") {
    displayValue = "-"
  }
  displayValue += number;
  display.innerText = limitCharacters(displayValue);
}

function getNewOperator(clickedOperator) {
  if (operator === undefined) {
    // if you've only entered 1 operand and clicked an operator, move that operand to pending, and store the operator in preparation for the 2nd operand
    if ((displayValue != undefined) && (pendingValue === undefined)) {
      pendingValue = displayValue;
      displayValue = undefined;
      display.innerText = limitCharacters(pendingValue);
    }
  } else {
    // if you have both operands and an operator and you click a 2nd operator, solve the problem, move the solution to pending, and store the 2nd operator in preparation for the 2nd operand
    if ((pendingValue != undefined) && (displayValue != undefined)) {
      let solution = operate(pendingValue, operator, displayValue);
      display.innerText = limitCharacters(solution.toString());
      pendingValue = solution;
      displayValue = undefined;
    }
  }
  operator = clickedOperator.target.id;
}

function clearAll() {
  displayValue = "0";
  pendingValue = undefined;
  operator = undefined;
  display.innerText = displayValue;
}

function clear() {
  displayValue = "0";
  display.innerText = displayValue;
}

function backspace() {
  displayValue = displayValue.substring(0, displayValue.length - 1);
  if (displayValue === "") {
    displayValue = "0";
  }
  display.innerText = limitCharacters(displayValue);
}

function togglePositiveNegative(number) {
  let displayValueString = displayValue.toString();
  if (displayValueString.includes("-")) {
    displayValue = displayValueString.substring(1);
  } else {
    displayValue = "-" + displayValueString;
  }
  display.innerText = limitCharacters(displayValue);
}

function addDecimal() {
  if (displayValue === undefined) {
    displayValue = "0.";
  }
  if (!displayValue.includes(".")) {
    displayValue += ".";
  }
  display.innerText = limitCharacters(displayValue);
}

function operate(a, operator, b) {
  switch (operator) {
    case "add":
    return add(a, b);
    break;
    case "subtract":
    return subtract(a, b);
    break;
    case "multiply":
    return multiply(a, b);
    break;
    case "divide":
    return divide(a, b);
    break;
    default:
    return;
  }
}

function add(a, b) {
  return parseFloat(a) + parseFloat(b);
}

function subtract(a, b) {
  return parseFloat(a) - parseFloat(b);
}

function multiply(a, b) {
  return parseFloat(a) * parseFloat(b);
}

function divide(a, b) {
  if (b == 0) {
    display.innerText = "ERROR";
  } else {
    return parseFloat(a) / parseFloat(b);
  }
}
