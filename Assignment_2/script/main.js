if (typeof annyang !== "undefined") {
    const commands = {
      'hello': () => {
        alert('Hello World!');
      },
  
      'change the color to *color': (color) => {
        document.body.style.backgroundColor = color;
      },
  
      'navigate to *page': (page) => {
        const destination = page.toLowerCase();
        if (destination.includes("home")) {
          window.location.href = "home.html";
        } else if (destination.includes("stocks")) {
          window.location.href = "stocks.html";
        } else if (destination.includes("dogs")) {
          window.location.href = "dogs.html";
        } else {
          alert("Page not found.");
        }
      }
    };
  
    annyang.addCommands(commands);
  }
  