const makeDropDown = (listId, dataArray, type) => {
  const listContainer = document.getElementById(listId);
  dataArray.forEach((item) => {
    const li = document.createElement("li");
    li.innerHTML = `
       <a onclick="loadFilterItem('${type}', '${item}')" class="hover:bg-gray-700 hover:text-white">${item}</a>
    `;
    listContainer.appendChild(li);
  });
};

const setDropDownName = (type, filterWord) => {
  const typeToElementMap = {
    region: "filter_by_region",
    capital: "filter_by_capital",
    lang: "filter_by_language",
  };

  Object.keys(typeToElementMap).forEach((key) => {
    document.getElementById(typeToElementMap[key]).innerText =
      key === type ? `(${filterWord})` : "";
  });
};

const loadFilterItem = async (type, filterName) => {
  let url = "";
  switch (type) {
    case "region":
      url = `https://restcountries.com/v3.1/region/${filterName}`;
      break;
    case "lang":
      url = `https://restcountries.com/v3.1/lang/${filterName}`;
      break;
    case "capital":
      url = `https://restcountries.com/v3.1/capital/${filterName}`;
      break;
    default:
      return;
  }

  try {
    document.getElementById("spinner").style.display = "flex";
    const res = await fetch(url);
    const data = await res.json();
    countriesData = data;
    setDropDownName(type, filterName);
  } catch (err) {
    console.log(err);
  } finally {
    document.getElementById("spinner").style.display = "none";
  }

  curentIndex = 0;
  const countriesContainer = document.getElementById("countries_container");
  countriesContainer.innerHTML = "";
  displayCountries();
};
