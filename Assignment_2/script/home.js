document.addEventListener("DOMContentLoaded", () => {
    const quoteElement = document.getElementById("quote");
  
    fetch("https://zenquotes.io/api/random")
      .then(res => res.json())
      .then(data => {
        quoteElement.textContent = `"${data[0].q}" — ${data[0].a}`;
      })
      .catch(err => {
        console.error("Failed to load quote:", err);
        quoteElement.textContent = "Couldn't load quote. Try refreshing!";
      });
  });
  