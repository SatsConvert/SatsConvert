document.addEventListener("DOMContentLoaded", () => {
  let currentBtcPrice = null;

  async function updateUSD() {
    const usdCells = document.querySelectorAll("#satoshiTable .usd");
    const countdownElement = document.getElementById("countdown");
    const satsValueElement = document.getElementById("satsValue");
    const usdInput = document.getElementById("usdInput");
    const customSatsValueElement = document.getElementById("customSatsValue");
    const satsInput = document.getElementById("satsInput");
    const customUsdValueElement = document.getElementById("customUsdValue");

    try {
      const response = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd");
      if (!response.ok) {
        throw new Error("Failed to fetch Bitcoin price");
      }
      const data = await response.json();
      currentBtcPrice = data.bitcoin.usd;

      // Update the BTC to USD conversion in the table
      const rows = document.querySelectorAll("#satoshiTable tbody tr");
      rows.forEach((row, index) => {
        const btcAmount = parseFloat(row.cells[0].textContent);
        const usdValue = btcAmount * currentBtcPrice;
        usdCells[index].textContent = "$" + usdValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        usdCells[index].classList.remove('highlight');
        setTimeout(() => {
          usdCells[index].classList.add('highlight');
          console.log("Highlight added to index:", index);
        }, 10);
      });

      // Update 1 USD to sats conversion
      const satsPerBtc = 100000000;
      const usdToSats = (1 / currentBtcPrice) * satsPerBtc;
      satsValueElement.textContent = usdToSats.toLocaleString('en-US', { maximumFractionDigits: 0 });

      // Update custom USD to sats conversion if input exists
      if (usdInput.value) {
        convertCustomUsdToSats();
      }

      // Update custom Sats to USD conversion if input exists
      if (satsInput.value) {
        convertCustomSatsToUsd();
      }

    } catch (error) {
      console.error("Error updating USD values:", error.message);
      usdCells.forEach(cell => {
        cell.textContent = "Error: Check connection";
        cell.style.color = "#FF4444";
      });
      satsValueElement.textContent = "Error";
      customSatsValueElement.textContent = "Error";
      customUsdValueElement.textContent = "Error";
    } finally {
      startCountdown(60, countdownElement);
    }
  }

  function convertCustomUsdToSats() {
    const usdInput = document.getElementById("usdInput");
    const customSatsValueElement = document.getElementById("customSatsValue");
    const usdAmount = parseFloat(usdInput.value);

    if (isNaN(usdAmount) || usdAmount < 0 || !currentBtcPrice) {
      customSatsValueElement.textContent = "Invalid input";
      return;
    }

    const satsPerBtc = 100000000;
    const usdToSats = (usdAmount / currentBtcPrice) * satsPerBtc;
    customSatsValueElement.textContent = usdToSats.toLocaleString('en-US', { maximumFractionDigits: 0 });
  }

  function convertCustomSatsToUsd() {
    const satsInput = document.getElementById("satsInput");
    const customUsdValueElement = document.getElementById("customUsdValue");
    const satsAmount = parseFloat(satsInput.value);

    if (isNaN(satsAmount) || satsAmount < 0 || !currentBtcPrice) {
      customUsdValueElement.textContent = "Invalid input";
      return;
    }

    const satsPerBtc = 100000000;
    const usdValue = (satsAmount / satsPerBtc) * currentBtcPrice;
    customUsdValueElement.textContent = "$" + usdValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function startCountdown(seconds, element) {
    if (!element) return;
    element.textContent = `Next update in ${seconds} seconds`;
    const countdown = setInterval(() => {
      seconds--;
      if (seconds >= 0) {
        element.textContent = `Next update in ${seconds} seconds`;
      } else {
        clearInterval(countdown);
      }
    }, 1000);
  }

  // Add event listeners for real-time conversion
  const usdInput = document.getElementById("usdInput");
  usdInput.addEventListener("input", convertCustomUsdToSats);

  const satsInput = document.getElementById("satsInput");
  satsInput.addEventListener("input", convertCustomSatsToUsd);

  updateUSD();
  setInterval(updateUSD, 60000);
});