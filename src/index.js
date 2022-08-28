import  searchApi  from './apiSearch'
import { renderMarkup } from './renderMarkup'
// import cards from "./templates/cards.hbs"
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";


let query = '';
let page = 1;
const perPage = 40;


// let lightbox = new SimpleLightbox('.gallery a', {
//   captions: true,
//   captionsData: 'alt',
// });


const searchForm = document.querySelector('.search-form')
const gallery = document.querySelector('.gallery')

searchForm.addEventListener('submit', onSubmit);

function onSubmit(evt) {
    evt.preventDefault();
    query = evt.currentTarget.searchQuery.value.trim()
    
    if (query === '') {
    return;
    }
    
    
    searchApi(query, page, perPage)
        .then(data => {
            if (data.totalHits === 0) {
                Notify.failure('Sorry, there are no images matching your search query. Please try again.')
            }
            else {
                renderMarkup(data.hits)
                Notify.success(`Hooray! We found ${data.totalHits} images.`)
                let simpleLightBox = new SimpleLightbox('.gallery a').refresh()

            const { height: cardHeight } = document
                .querySelector('.gallery')
                .firstElementChild.getBoundingClientRect();
  
            window.scrollBy({
                    top: cardHeight * -100,
                    behavior: 'smooth',
                });
            }
        }).catch(error => console.log(error))
  
}

//====================================================================




