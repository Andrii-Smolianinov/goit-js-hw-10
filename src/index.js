import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import debounce from 'lodash.debounce';
const DEBOUNCE_DELAY = 300;
const inputEl = document.getElementById('search-box');
const countryListEl = document.querySelector('.country-list');
const countryInfoEl = document.querySelector('.country-info');

inputEl.addEventListener('input', debounce(onSearchCountry, DEBOUNCE_DELAY));

function onSearchCountry() {
  const inputValue = inputEl.value.trim();
  if (inputValue !== '') {
    fetchCountries(inputValue)
      .then(filterCountries)
      .catch(() => Notify.failure('Країну з такою назвою не знайдено!'));
    clearSearch();
  }
}

function clearSearch() {
  countryListEl.innerHTML = '';
  countryInfoEl.innerHTML = '';
}

function filterCountries(countries) {
  if (countries.length > 2 && countries.length < 10) {
    renderCountriesList(countries);
  } else if (countries.length === 1) {
    renderCountriesInfo(countries);
  } else if (countries.length > 10) {
    Notify.info(
      'Знайдено забагато збігів. Будь ласка, введіть більш конкретну назву країни'
    );
    clearSearch();
  }
}

function renderCountriesList(countries) {
  const markup = countries
    .map(({ name, flags }) => {
      return `<li>
      <h2 class="tittle_info"><img src="${flags.svg}" width="30px"></img> ${name}</h2>
      </li>`;
    })
    .join('');
  countryListEl.innerHTML = markup;
}

function renderCountriesInfo(countries) {
  const markup = countries
    .map(({ name, capital, population, flags, languages }) => {
      const languagesCorrect = [];
      languages.map(language => {
        languagesCorrect.push(language.name);
      });
      const language = languagesCorrect.join(', ');

      return `
        <h2 class="tittle_info"><img src="${flags.svg}" width="30px"></img> ${name}</h2>
        <p class="list_info"><b>Capital</b>: ${capital}</p>
        <p class="list_info"><b>Population</b>: ${population}</p>
        <p class="list_info"><b>Languages</b>: ${language}</p>`;
    })
    .join('');
  countryInfoEl.innerHTML = markup;
}
