document.addEventListener("DOMContentLoaded", () => {
    fetchDogImages();
    fetchDogBreeds();
    setupVoiceCommands();
  });
  
  function fetchDogImages() {
    fetch("https://api.thedogapi.com/v1/images/search?limit=10")
      .then(res => res.json())
      .then(data => {
        const carousel = document.getElementById("carousel");
        carousel.innerHTML = "";
  
        const sliderWrapper = document.createElement("div");
        sliderWrapper.classList.add("slider");
  
        data.forEach((imgObj) => {
          const img = document.createElement("img");
          img.src = imgObj.url;
          img.style.width = "600px";
          img.style.height = "auto";
          img.style.borderRadius = "10px";
          img.style.display = "block";
          img.style.margin = "0 auto";
          sliderWrapper.appendChild(img);
        });
  
        carousel.appendChild(sliderWrapper);
  
        new SimpleSlider(sliderWrapper, {
          autoPlay: true,
          interval: 3000,
          arrows: true
        });
      })
      .catch(err => console.error("Failed to load dog images", err));
  }
  
  let selectedBreeds = [];

    function fetchDogBreeds() {
    fetch("https://dogapi.dog/api/v2/breeds")
        .then(res => res.json())
        .then(data => {
        const breeds = data.data; // List of breed objects
        const container = document.getElementById("breedButtons");
        container.innerHTML = "";

        const shuffled = breeds.sort(() => 0.5 - Math.random());
        selectedBreeds = shuffled.slice(0, 10); // store 10 breeds

        selectedBreeds.forEach(breed => {
            const button = document.createElement("button");
            button.classList.add("breed-button");
            button.textContent = breed.attributes.name;
            button.addEventListener("click", () => showBreedInfo(breed));
            container.appendChild(button);
        });
        })
        .catch(err => console.error("Failed to load Dog API V2 breeds", err));
    }

  
    function showBreedInfo(breed) {
        const info = document.getElementById("breedInfo");
        info.style.display = "block";
      
        info.innerHTML = `
          <h3>Name: ${breed.attributes.name}</h3>
          <p><strong>Description:</strong> ${breed.attributes.description || "No description available."}</p>
          <p><strong>Life Span:</strong> ${breed.attributes.lifespan || "Unknown"}</p>
        `;

        fetch(`https://dogapi.dog/api/v2/breeds/${breed.id}`)
          .then(res => res.json())
          .then(data => {
            const imageUrl = data.data.attributes.image;
            if (imageUrl) {
              const img = document.createElement("img");
              img.src = imageUrl;
              img.alt = breed.attributes.name;
              img.style.width = "300px";
              img.style.marginTop = "10px";
              info.appendChild(img);
            }
          })
          .catch(err => console.error("Failed to load breed image", err));
    }
      
  
  function setupVoiceCommands() {
    if (annyang) {
      const commands = {
        'navigate to *page': (page) => {
          const dest = page.toLowerCase();
          if (dest.includes("home")) window.location.href = "home.html";
          else if (dest.includes("stock")) window.location.href = "stocks.html";
          else if (dest.includes("dog")) window.location.href = "dogs.html";
        },
        'change the color to *color': (color) => {
          document.body.style.backgroundColor = color;
        },
        'hello': () => {
          alert("Hello from the Dogs page!");
        },
        'load dog breed *breedName': (breedName) => {
          const match = breedName.toLowerCase();
          const buttons = document.querySelectorAll(".breed-button");
          buttons.forEach(btn => {
            if (btn.textContent.toLowerCase() === match) {
              btn.click();
            }
          });
        }
      };
  
      annyang.addCommands(commands);
      annyang.start();
    }
  }  