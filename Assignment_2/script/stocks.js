const API_KEY = "kO59CFXgbSsxcaShkvRicZBePQgM3iZE";

document.addEventListener("DOMContentLoaded", () => {
  setupRedditStocks();
  setupLookupButton();
  setupVoiceCommands();
});

function setupLookupButton() {
  document.getElementById("lookupBtn").addEventListener("click", async () => {
    const ticker = document.getElementById("tickerInput").value.toUpperCase();
    const days = parseInt(document.getElementById("dayRange").value);

    if (!ticker) {
      alert("Please enter a stock ticker!");
      return;
    }

    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - days);

    const formatDate = (date) => date.toISOString().split("T")[0];

    const url = `https://api.polygon.io/v2/aggs/ticker/${ticker}/range/1/day/${formatDate(start)}/${formatDate(end)}?adjusted=true&sort=asc&limit=${days}&apiKey=${API_KEY}`;

    try {
      const res = await fetch(url);
      const data = await res.json();

      if (!data.results || data.results.length === 0) {
        alert("No data found.");
        return;
      }

      const labels = data.results.map(item => new Date(item.t).toLocaleDateString());
      const prices = data.results.map(item => item.c);
      drawChart(labels, prices, ticker);
    } catch (err) {
      console.error("Error fetching stock data:", err);
      alert("There was an error fetching stock data.");
    }
  });
}

let stockChart;

function drawChart(labels, data, ticker) {
  const ctx = document.getElementById("stockChart").getContext("2d");

  if (stockChart) stockChart.destroy();

  stockChart = new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [{
        label: `Closing Prices for ${ticker}`,
        data,
        borderColor: "blue",
        borderWidth: 2,
        fill: false,
        tension: 0.3
      }]
    },
    options: {
      responsive: true,
      scales: {
        x: {
          title: { display: true, text: "Date" }
        },
        y: {
          title: { display: true, text: "Price (USD)" }
        }
      }
    }
  });
}

function setupRedditStocks() {
  const table = document.getElementById("redditTableBody");

  fetch("https://tradestie.com/api/v1/apps/reddit?date=2022-04-03")
    .then(res => res.json())
    .then(data => {
      const top5 = data.slice(0, 5);
      top5.forEach(stock => {
        const row = document.createElement("tr");
        const sentimentIcon = stock.sentiment === "Bullish"
          ? '<img src="bull.jpg" width="50">'
          : '<img src="bear.jpg" width="50">';

        row.innerHTML = `
          <td><a href="https://finance.yahoo.com/quote/${stock.ticker}" target="_blank">${stock.ticker}</a></td>
          <td>${stock.no_of_comments}</td>
          <td>${sentimentIcon}</td>
        `;
        table.appendChild(row);
      });
    })
    .catch(err => console.error("Error fetching Reddit stocks:", err));
}

function setupVoiceCommands() {
  if (annyang) {
    const commands = {
      'navigate to *page': (page) => {
        if (page.includes("home")) window.location.href = "home.html";
        else if (page.includes("stock")) window.location.href = "stocks.html";
        else if (page.includes("dog")) window.location.href = "dogs.html";
      },
      'change the color to *color': (color) => {
        document.body.style.backgroundColor = color;
      },
      'hello': () => {
        alert("Hello from the Stocks page!");
      },
      'lookup *ticker': (ticker) => {
        document.getElementById("tickerInput").value = ticker.toUpperCase();
        document.getElementById("dayRange").value = "30";
        document.getElementById("lookupBtn").click();
      }
    };
    annyang.addCommands(commands);
    annyang.start();
  }
}
