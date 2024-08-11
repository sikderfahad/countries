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
    console.log(data);
    countriesData = data;
    displayCountries();
    storeRegion();
    1;
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
    const { flags, name, cca2, capital, area, region } = country;
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
                    <button onclick="handledModal('${cca2}')" class="btn btn-primary text-white">Queries</button>
                </div>
            </div>
        </div>
    `;
    countriesContainer.appendChild(newCountry);
  });
};

const handledModal = async (code) => {
  console.log(code);
  try {
    document.getElementById("spinner").style.display = "flex";
    const url = `https://restcountries.com/v3.1/alpha/${code}`;
    const res = await fetch(url);
    const data = await res.json();
    displayDataInModal(data[0]);
  } catch (err) {
    console.log(err);
  } finally {
    document.getElementById("spinner").style.display = "none";
  }
};

const displayDataInModal = (country) => {
  console.log(country);
  const { area, capital, name, flags, population, languages, timezones } =
    country;
  setInnerText("country_area", area);
  setInnerText("country_capital", capital);
  setInnerText("country_name", name?.common);
  document.getElementById("country_img").setAttribute("src", flags?.png);
  setInnerText("country_population", population);
  setInnerText("timezone", timezones?.[0]);

  languages &&
    Object.values(languages).forEach((lang) =>
      setInnerText("country_lang", lang)
    );
  const modalBody = document.getElementById("country_modal");
  modalBody.showModal();
};

const setInnerText = (textId, value) => {
  document.getElementById(textId).innerText = value;
};

let debounceTimer;
const checkScroll = () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    if (
      scrollTop + clientHeight >= scrollHeight - 200 &&
      curentIndex < countriesData.length
    ) {
      displayCountries();
    }
  }, 200);
};

window.addEventListener("scroll", checkScroll);
window.addEventListener("touchmove", checkScroll); // Add this line

loadCountries();
