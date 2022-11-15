import './css/styles.css';
import fetchCountries from './fetchCountries.js';
import Notiflix from 'notiflix';
const lodash = require('lodash.debounce')

const DEBOUNCE_DELAY = 300;

const refs = {
    input: document.querySelector('#search-box'),
    list: document.querySelector(".country-list"),
    card: document.querySelector(".country-info")
};
refs.input.addEventListener('input', lodash(onInput, DEBOUNCE_DELAY));

function onInput(event) {
  const inputValue = event.target.value.trim();
    fetchCountries(inputValue).then(createList).catch(catchFailures);
    if (inputValue === "") {
        refs.list.innerHTML = ""
        refs.card.innerHTML = ""
    }
}

function createList(data) {
    console.log(data)
    if (data.length > 10) {
         Notiflix.Notify.info("Too many matches found. Please enter a more specific name.")
    } else if (data.length >= 2 && data.length <= 10) {
        refs.list.innerHTML = getMarkupOfList(data)
        refs.card.innerHTML = ""
    } else if (data.length === 1) {
        refs.card.innerHTML = getMarkupOfCard(data)
        refs.list.innerHTML = ""
    } 
}


function getMarkupOfList(data) {
    return data.map(({ flags: { svg }, name: { official } })=> {
        return `<li>
            <img src="${svg}" alt="Flag of ${official}" width="35px" height="25px">
            <p>${official}</p>
        </li>`;
    })
        .join("");
}

function getMarkupOfCard(data) {
    return data.map(({ flags: { svg }, name: { official }, capital, population, languages }) => {
        return `<h2>
            <img src="${svg}" alt="Flag of ${official}" width="35px" height="25px"> 
            <strong>${official}</strong>
        </h2>
        <ul>
            <li><p><strong>Capital: </strong>${capital}</p></li>
            <li><p><strong>Population: </strong>${population}</p></li>
            <li><p><strong>Languages: </strong>${Object.values(languages)}</p></li>
        </ul>`

    })
        .join("")
}

function catchFailures() {  
        Notiflix.Notify.failure("Oops, there is no country with that name")
}