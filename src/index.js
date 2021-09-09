import { Notify } from 'notiflix';
import SimpleLightbox from 'simplelightbox';

import 'simplelightbox/dist/simple-lightbox.min.css';
import './sass/main.scss';
const axios = require('axios').default;

const URL = 'https://pixabay.com/api/';
const searchOption = {
  params: {
    key: '23292870-e9e1fc8f4fc8bd7151266ea82',
    q: `cat`,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    per_page: 40,
    page: 0,
  },
};

const refs = {
  form: document.querySelector('#search-form'),
  input: document.querySelector('.search-form__input'),
  btn: document.querySelector('.search-form__button'),
  loadMoreBtn: document.querySelector('.load-more'),
  clearBtn: document.querySelector('.clear-btn'),
  gallery: document.querySelector('.gallery'),
  card: document.querySelector('.photo-card'),
};

refs.form.addEventListener('submit', onFormSubmit);
refs.loadMoreBtn.addEventListener('click', loadMore);
refs.clearBtn.addEventListener('click', clearInterface);

let gallery = new SimpleLightbox('.gallery a', {
  showCounter: true,
  disableScroll: true,
});

function onCardClick(evt) {
  evt.preventDefault();

  gallery.open('.gallery');
}

function onFormSubmit(e) {
  e.preventDefault();
  searchOption.params.page = 0;

  getColection(e.currentTarget.searchQuery.value)
    .then(onSucces)
    .catch(() =>
      Notify.failure('Sorry, there are no images matching your search query. Please try again.'),
    );

  refs.form.reset();
}

function onSucces(respond) {
  clearInterface();

  makeMarkUp(respond);

  refs.gallery.addEventListener('click', onCardClick);
  gallery.refresh();

  Notify.success(`Hooray! We found ${respond.data.totalHits} images.`);
}

function clearInterface() {
  refs.gallery.removeEventListener('click', onCardClick);
  refs.gallery.innerHTML = '';
  refs.loadMoreBtn.classList.add('visually-hidden');
}

async function getColection(query = searchOption.params.q) {
  searchOption.params.q = `${query}`;
  searchOption.params.page = searchOption.params.page + 1;

  const respons = await axios.get(URL, searchOption);

  if (respons.data.hits.length === 0) {
    throw new Error();
  }

  return respons;
}

function loadMore() {
  getColection()
    .then(resp => {
      makeMarkUp(resp);
      gallery.refresh();
      smoothScroll();
    })
    .catch(() => {
      Notify.failure("We're sorry, but you've reached the end of search results.");
      refs.loadMoreBtn.classList.add('visually-hidden');
    });
}

function smoothScroll() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 8 + 500,
    behavior: 'smooth',
  });
}

function makeMarkUp({ data }) {
  const a = data.hits.map(el => makeCard(el)).join('');

  refs.gallery.insertAdjacentHTML('beforeend', a);

  refs.loadMoreBtn.classList.remove('visually-hidden');
}

function makeCard({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) {
  return `<a href="${largeImageURL}" class="photo-card" >
  <img src="${webformatURL}" alt="${tags}" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes</b>
      ${likes}
    </p>
    <p class="info-item">
      <b>Views</b>
      ${views}
    </p>
    <p class="info-item">
      <b>Comments</b>
      ${comments}
    </p>
    <p class="info-item">
      <b>Downloads</b>
      ${downloads}
    </p>
  </div>
</a>`;
}
