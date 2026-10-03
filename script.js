// ==========================================
// SKILLCRAFT TECHNOLOGY
// TASK 02 - CALCULATOR WEB APPLICATION
// ==========================================


// ==========================================
// GET HTML ELEMENTS
// ==========================================

const currentDisplay =
    document.getElementById("currentDisplay");

const previousDisplay =
    document.getElementById("previousDisplay");

const errorDisplay =
    document.getElementById("error");

const numberButtons =
    document.querySelectorAll("[data-number]");

const operatorButtons =
    document.querySelectorAll("[data-operator]");

const clearButton =
    document.getElementById("clear");

const deleteButton =
    document.getElementById("delete");

const percentButton =
    document.getElementById("percent");

const equalsButton =
    document.getElementById("equals");

const historyButton =
    document.getElementById("historyButton");

const historyPanel =
    document.getElementById("historyPanel");

const closeHistory =
    document.getElementById("closeHistory");

const historyList =
    document.getElementById("historyList");

const clearHistoryButton =
    document.getElementById("clearHistory");


// ==========================================
// CALCULATOR VARIABLES
// ==========================================

let currentNumber = "";

let previousNumber = "";

let selectedOperator = "";


// ==========================================
// HISTORY
// ==========================================

let calculationHistory =
    JSON.parse(
        localStorage.getItem("calculatorHistory")
    ) || [];


// ==========================================
// UPDATE DISPLAY
// ==========================================

function updateDisplay() {

    if (currentNumber === "") {

        currentDisplay.textContent = "0";

    } else {

        currentDisplay.textContent = currentNumber;

    }


    if (
        previousNumber !== "" &&
        selectedOperator !== ""
    ) {

        previousDisplay.textContent =
            previousNumber +
            " " +
            getOperatorSymbol(selectedOperator);

    } else {

        previousDisplay.textContent = "";

    }
}


// ==========================================
// OPERATOR SYMBOL
// ==========================================

function getOperatorSymbol(operator) {

    if (operator === "*") {
        return "×";
    }

    if (operator === "/") {
        return "÷";
    }

    if (operator === "-") {
        return "−";
    }

    return operator;
}


// ==========================================
// ERROR HANDLING
// ==========================================

function showError(message) {

    errorDisplay.textContent = message;

    setTimeout(function () {

        errorDisplay.textContent = "";

    }, 2000);
}


// ==========================================
// INPUT NUMBER
// ==========================================

function inputNumber(number) {

    // Prevent multiple decimal points
    if (
        number === "." &&
        currentNumber.includes(".")
    ) {

        return;
    }


    // Start decimal with 0
    if (
        number === "." &&
        currentNumber === ""
    ) {

        currentNumber = "0.";

        updateDisplay();

        return;
    }


    // Prevent multiple zeros at beginning
    if (
        number === "0" &&
        currentNumber === "0"
    ) {

        return;
    }


    currentNumber += number;

    updateDisplay();
}


// ==========================================
// SELECT OPERATOR
// ==========================================

function selectOperator(operator) {

    // No number entered
    if (
        currentNumber === "" &&
        previousNumber === ""
    ) {

        showError("Please enter a number");

        return;
    }


    // Change operator
    if (
        currentNumber === "" &&
        previousNumber !== ""
    ) {

        selectedOperator = operator;

        updateDisplay();

        return;
    }


    // Calculate previous operation first
    if (
        previousNumber !== "" &&
        selectedOperator !== ""
    ) {

        calculate();
    }


    previousNumber = currentNumber;

    currentNumber = "";

    selectedOperator = operator;

    updateDisplay();
}


// ==========================================
// CALCULATE
// ==========================================

function calculate() {

    // Check incomplete calculation
    if (
        previousNumber === "" ||
        currentNumber === "" ||
        selectedOperator === ""
    ) {

        showError("Incomplete calculation");

        return;
    }


    // Parse input strings into numbers
    const firstNumber =
        parseFloat(previousNumber);

    const secondNumber =
        parseFloat(currentNumber);

    let result;


    // Check invalid numbers
    if (
        isNaN(firstNumber) ||
        isNaN(secondNumber)
    ) {

        showError("Invalid input");

        return;
    }


    // ADDITION
    if (selectedOperator === "+") {

        result =
            firstNumber + secondNumber;

    }


    // SUBTRACTION
    else if (selectedOperator === "-") {

        result =
            firstNumber - secondNumber;

    }


    // MULTIPLICATION
    else if (selectedOperator === "*") {

        result =
            firstNumber * secondNumber;

    }


    // DIVISION
    else if (selectedOperator === "/") {

        // Division by zero error
        if (secondNumber === 0) {

            showError("Cannot divide by zero");

            currentNumber = "";

            previousNumber = "";

            selectedOperator = "";

            updateDisplay();

            return;
        }


        result =
            firstNumber / secondNumber;

    }


    // INVALID OPERATOR
    else {

        showError("Invalid operator");

        return;
    }


    // Reduce floating point errors
    result =
        Number(result.toPrecision(12));


    // Create expression for history
    const expression =
        `${firstNumber} ${getOperatorSymbol(selectedOperator)} ${secondNumber}`;


    // Save calculation
    addToHistory(
        expression,
        result
    );


    // Display result
    currentNumber =
        result.toString();

    previousNumber = "";

    selectedOperator = "";

    updateDisplay();
}


// ==========================================
// CLEAR CALCULATOR
// ==========================================

function clearCalculator() {

    currentNumber = "";

    previousNumber = "";

    selectedOperator = "";

    errorDisplay.textContent = "";

    updateDisplay();
}


// ==========================================
// DELETE LAST CHARACTER
// ==========================================

function deleteNumber() {

    if (currentNumber !== "") {

        currentNumber =
            currentNumber.slice(0, -1);
    }

    updateDisplay();
}


// ==========================================
// PERCENTAGE
// ==========================================

function calculatePercentage() {

    if (currentNumber === "") {

        showError("Please enter a number");

        return;
    }


    const number =
        parseFloat(currentNumber);


    if (isNaN(number)) {

        showError("Invalid number");

        return;
    }


    currentNumber =
        (number / 100).toString();

    updateDisplay();
}


// ==========================================
// ADD CALCULATION TO HISTORY
// ==========================================

function addToHistory(
    expression,
    result
) {

    const calculation = {

        expression: expression,

        result: result
    };


    // Add newest calculation first
    calculationHistory.unshift(
        calculation
    );


    // Keep only 20 calculations
    if (
        calculationHistory.length > 20
    ) {

        calculationHistory.pop();
    }


    // Save history in browser
    localStorage.setItem(
        "calculatorHistory",
        JSON.stringify(calculationHistory)
    );


    displayHistory();
}


// ==========================================
// DISPLAY HISTORY
// ==========================================

function displayHistory() {

    historyList.innerHTML = "";


    // No history
    if (
        calculationHistory.length === 0
    ) {

        historyList.innerHTML =
            `<p class="empty-history">
                No calculations yet.
            </p>`;

        return;
    }


    // Display every calculation
    calculationHistory.forEach(
        function (calculation) {

            const historyItem =
                document.createElement("div");


            historyItem.className =
                "history-item";


            historyItem.textContent =
                `${calculation.expression} = ${calculation.result}`;


            historyList.appendChild(
                historyItem
            );

        }
    );
}


// ==========================================
// CLEAR HISTORY
// ==========================================

function clearHistory() {

    calculationHistory = [];

    localStorage.removeItem(
        "calculatorHistory"
    );

    displayHistory();
}


// ==========================================
// NUMBER BUTTON EVENTS
// ==========================================

numberButtons.forEach(
    function (button) {

        button.addEventListener(
            "click",
            function () {

                const number =
                    button.getAttribute(
                        "data-number"
                    );

                inputNumber(number);

            }
        );

    }
);


// ==========================================
// OPERATOR BUTTON EVENTS
// ==========================================

operatorButtons.forEach(
    function (button) {

        button.addEventListener(
            "click",
            function () {

                const operator =
                    button.getAttribute(
                        "data-operator"
                    );

                selectOperator(operator);

            }
        );

    }
);


// ==========================================
// CLEAR BUTTON
// ==========================================

clearButton.addEventListener(
    "click",
    function () {

        clearCalculator();

    }
);


// ==========================================
// DELETE BUTTON
// ==========================================

deleteButton.addEventListener(
    "click",
    function () {

        deleteNumber();

    }
);


// ==========================================
// PERCENTAGE BUTTON
// ==========================================

percentButton.addEventListener(
    "click",
    function () {

        calculatePercentage();

    }
);


// ==========================================
// EQUAL BUTTON
// ==========================================

equalsButton.addEventListener(
    "click",
    function () {

        calculate();

    }
);


// ==========================================
// HISTORY BUTTON
// ==========================================

historyButton.addEventListener(
    "click",
    function () {

        displayHistory();

        historyPanel.classList.add(
            "show"
        );

    }
);


// ==========================================
// CLOSE HISTORY
// ==========================================

closeHistory.addEventListener(
    "click",
    function () {

        historyPanel.classList.remove(
            "show"
        );

    }
);


// ==========================================
// CLEAR HISTORY BUTTON
// ==========================================

clearHistoryButton.addEventListener(
    "click",
    function () {

        clearHistory();

    }
);


// ==========================================
// KEYBOARD INPUT
// ==========================================

document.addEventListener(
    "keydown",
    function (event) {

        const key = event.key;


        // Numbers
        if (
            key >= "0" &&
            key <= "9"
        ) {

            inputNumber(key);

            return;
        }


        // Decimal point
        if (key === ".") {

            inputNumber(".");

            return;
        }


        // Operators
        if (
            key === "+" ||
            key === "-" ||
            key === "*" ||
            key === "/"
        ) {

            selectOperator(key);

            return;
        }


        // Enter or =
        if (
            key === "Enter" ||
            key === "="
        ) {

            event.preventDefault();

            calculate();

            return;
        }


        // Backspace
        if (key === "Backspace") {

            deleteNumber();

            return;
        }


        // Escape
        if (key === "Escape") {

            clearCalculator();

            return;
        }


        // Percentage
        if (key === "%") {

            calculatePercentage();

            return;
        }

    }
);


// ==========================================
// LOAD SAVED HISTORY
// ==========================================

displayHistory();


// ==========================================
// INITIAL DISPLAY
// ==========================================

updateDisplay();