async function updateUSD() {
  const usdCells = document.querySelectorAll("#satoshiTable .usd");

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
    });

  } catch (error) {
    console.error("Error updating USD values:", error.message);
    usdCells.forEach(cell => {
      cell.textContent = "Error: Check connection";
      cell.style.color = "#FF4444";
    });
  }
}

updateUSD();
setInterval(updateUSD, 60000);