import  searchApi   from './js/apiSearch'
import cards from "./templates/cards.hbs"
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";


let query = '';
let page = 1;
const perPage = 40;

let lightbox = new SimpleLightbox('.gallery a', {
  captionDelay: 150,
});


const searchForm = document.querySelector('.search-form')
const gallery = document.querySelector('.gallery')
const loadMore = document.querySelector('.btn-load-more')

searchForm.addEventListener('submit', onSubmit);

async function onSubmit(evt) {
    evt.preventDefault();
    query = evt.currentTarget.searchQuery.value.trim();
    
    if (query === '') {
        Notify.failure('Please enter some query .')
        return;
    }
    page = 1;
    gallery.innerHTML = '';
     
    const response = await searchApi(query, page, perPage);

     
    try {
        if (response.totalHits === 0) {
            Notify.failure('Sorry, there are no images matching your search query. Please try again.')
            loadMore.classList.add('is-hidden')
        }
        else {
            const markup = cards(response.hits)
            gallery.insertAdjacentHTML('beforeend', markup)
            Notify.success(`Hooray! We found ${response.totalHits} images.`)
            lightbox.refresh();

            //=== при перевірці словом "kate" - тобто там де картинок менше 40 в мене одразу два алерта. 
            //без цього, червоний алерт з'являється писла натискання на кнопку яка потім зникає - чи це вірно
            if (response.totalHits < 40) {
                loadMore.classList.add('is-hidden')
                Notify.failure('We are sorry, but you have reached the end of search results.')
            }
            //================

            if (response.totalHits > perPage) {
                loadMore.classList.remove('is-hidden')
            }
        }
    } catch (error) {
        console.log(error)
    }

  
}
loadMore.addEventListener('click',onLoadMore)

 function onLoadMore(evt) {
    page += 1
     searchApi(query, page, perPage)
        .then(data => {
            const markup = cards(data.hits)
            gallery.insertAdjacentHTML('beforeend', markup)
            smoothScroll()
            lightbox.refresh();
            const endOfSearch = Math.ceil(data.totalHits / perPage)
                if (page > endOfSearch) {                
                loadMore.classList.add('is-hidden')          
                Notify.failure('We are sorry, but you have reached the end of search results.')
                }
        })

}

function smoothScroll() {
    const { height: cardHeight } = document
        .querySelector(".gallery")
        .firstElementChild.getBoundingClientRect();

    window.scrollBy({
        top: cardHeight * 2,
        behavior: "smooth",
    });
}