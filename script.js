document.addEventListener("DOMContentLoaded", () => {
  async function updateUSD() {
    const usdCells = document.querySelectorAll("#satoshiTable .usd");
    const countdownElement = document.getElementById("countdown");

    try {
      const response = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd");
      if (!response.ok) {
        throw new Error("Failed to fetch Bitcoin price");
      }
      const data = await response.json();
      const btcPrice = data.bitcoin.usd;

      const rows = document.querySelectorAll("#satoshiTable tbody tr");
      rows.forEach((row, index) => {
        const btcAmount = parseFloat(row.cells[0].textContent);
        const usdValue = btcAmount * btcPrice;
        usdCells[index].textContent = "$" + usdValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        usdCells[index].classList.remove('highlight');
        setTimeout(() => {
          usdCells[index].classList.add('highlight');
          console.log("Highlight added to index:", index);
        }, 10);
      });

    } catch (error) {
      console.error("Error updating USD values:", error.message);
      usdCells.forEach(cell => {
        cell.textContent = "Error: Check connection";
        cell.style.color = "#FF4444";
      });
    } finally {
      startCountdown(60, countdownElement);
    }
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

  updateUSD();
  setInterval(updateUSD, 60000);
}); 