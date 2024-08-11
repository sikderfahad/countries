let countriesData = [];
let itemsPerPage = 15;
let curentIndex = 0;

let allRegion = [];
let allLanguages = [];
let allCapitals = [];

const loadCountries = async () => {
  try {
    document.getElementById("spinner").style.display = "flex";
    const url = `https://restcountries.com/v3.1/all`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Network response was not ok");
    const data = await res.json();
    countriesData = data;
    displayCountries();
    storeRegion();
  } catch (err) {
    console.error("Failed to load countries data:", err);
  } finally {
    document.getElementById("spinner").style.display = "none";
  }
};

// Store all region, languages & capital cities first for FILTER
const storeRegion = () => {
  countriesData.forEach((data) => {
    const isRegionExist = allRegion.includes(data.region);
    if (!isRegionExist) {
      allRegion.push(data.region);
    }

    if (data?.languages) {
      const langList = Object.values(data.languages);
      langList.forEach((lang) => {
        const checkDuplicateLang = allLanguages.includes(lang);
        if (!checkDuplicateLang) {
          allLanguages.push(lang);
        }
      });
    }

    if (data?.capital) {
      data?.capital.forEach((cap) => {
        const isCapitalExist = allCapitals.includes(cap);
        if (!isCapitalExist) {
          allCapitals.push(cap);
        }
      });
    }
  });
  makeDropDown("region_box", allRegion, "region");
  makeDropDown("capital_box", allCapitals, "capital");
  makeDropDown("language_box", allLanguages, "lang");
};

// console.log(allRegion);
// console.log(allLanguages);
// console.log(allCapitals);

const displayCountries = () => {
  const countriesContainer = document.getElementById("countries_container");

  const nextCountries = countriesData.slice(
    curentIndex,
    curentIndex + itemsPerPage
  );
  curentIndex += itemsPerPage;
  nextCountries.forEach((country) => {
    const { flags, name, capital, area, region } = country;
    const newCountry = document.createElement("div");
    newCountry.classList.add(
      "p-4",
      "mb-4",
      "bg-base-100",
      "shadow-xl",
      "border",
      "border-2",
      "rounded-2xl",
      "border-transparent",
      "hover:border-gray-700"
    );
    newCountry.innerHTML = `
        <div class="card card-compact">
            <figure class="w-full h-[200px]">
                <img class="w-full h-full" src="${flags?.png}" alt="${name?.common} flag" />
            </figure>
            <div class="card-body">
                <h2 class="card-title">${name?.common}</h2>
                <p>Area: ${area} KM<sup>2</sup></p>
                <p>Capital: ${capital}</p>
                <p>Region: ${region}</p>
                <div class="card-actions justify-end">
                    <button class="btn btn-primary text-white">Queries</button>
                </div>
            </div>
        </div>
    `;
    countriesContainer.appendChild(newCountry);
  });
};

let debounceTimer;
const checkScroll = () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    console.log(scrollTop);
    if (
      scrollTop + clientHeight >= scrollHeight - 20 &&
      curentIndex < countriesData.length
    ) {
      displayCountries();
    }
  }, 200);
};

window.addEventListener("scroll", checkScroll);
window.addEventListener("touchmove", checkScroll); // Add this line

loadCountries();
