export default function getRefs() {
  return {
    form: document.querySelector('#search-form'),
    input: document.querySelector('.search-form__input'),
    btn: document.querySelector('.search-form__button'),
    loadMoreBtn: document.querySelector('.load-more'),
    clearBtn: document.querySelector('.clear-btn'),
    gallery: document.querySelector('.gallery'),
    card: document.querySelector('.photo-card'),
  };
}

// const refs = {
//   form: document.querySelector('#search-form'),
//   input: document.querySelector('.search-form__input'),
//   btn: document.querySelector('.search-form__button'),
//   loadMoreBtn: document.querySelector('.load-more'),
//   clearBtn: document.querySelector('.clear-btn'),
//   gallery: document.querySelector('.gallery'),
//   card: document.querySelector('.photo-card'),
// };
