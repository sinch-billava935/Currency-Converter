const BASE_URL = "https://api.exchangerate-api.com/v4/latest/";

document.addEventListener("DOMContentLoaded", () => {
  const amountInput = document.querySelector(".amount input");
  const fromCurrencySelect = document.querySelector(".from select");
  const toCurrencySelect = document.querySelector(".To select");
  const resultMessage = document.querySelector(".msg");
  const form = document.querySelector("form");

  // Populate the dropdowns
  const populateDropdowns = () => {
    const currencyCodes = ["USD", "INR", "EUR", "AUD", "GBP", "JPY", "CAD"]; // Add more as needed
    for (let currency of currencyCodes) {
      const optionFrom = document.createElement("option");
      const optionTo = document.createElement("option");

      optionFrom.value = currency;
      optionFrom.textContent = currency;

      optionTo.value = currency;
      optionTo.textContent = currency;

      if (currency === "USD") optionFrom.selected = true; // Default selection for "from"
      if (currency === "INR") optionTo.selected = true; // Default selection for "to"

      fromCurrencySelect.appendChild(optionFrom);
      toCurrencySelect.appendChild(optionTo);
    }
  };

  const updateFlags = () => {
    const fromFlag = document.querySelector(".from img");
    const toFlag = document.querySelector(".To img");

    fromFlag.src = `https://flagsapi.com/${fromCurrencySelect.value.slice(0, 2).toUpperCase()}/flat/64.png`;
    toFlag.src = `https://flagsapi.com/${toCurrencySelect.value.slice(0, 2).toUpperCase()}/flat/64.png`;
  };

  const convertCurrency = async (event) => {
    event.preventDefault();

    const amount = parseFloat(amountInput.value) || 1;
    const fromCurrency = fromCurrencySelect.value;
    const toCurrency = toCurrencySelect.value;

    if (!amount || amount <= 0) {
      resultMessage.textContent = "Please enter a valid amount.";
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}${fromCurrency}`);
      if (!response.ok) {
        throw new Error("Failed to fetch exchange rate.");
      }

      const data = await response.json();
      const rate = data.rates[toCurrency];
      const convertedAmount = (amount * rate).toFixed(2);

      resultMessage.textContent = `${amount} ${fromCurrency} = ${convertedAmount} ${toCurrency}`;
    } catch (error) {
      resultMessage.textContent = "Error: Unable to fetch exchange rates.";
      console.error(error);
    }
  };

  // Initial setup
  populateDropdowns();
  updateFlags();

  // Event listeners
  fromCurrencySelect.addEventListener("change", updateFlags);
  toCurrencySelect.addEventListener("change", updateFlags);
  form.addEventListener("submit", convertCurrency);
});
