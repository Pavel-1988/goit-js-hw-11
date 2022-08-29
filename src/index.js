import  searchApi   from './js/apiSearch'
// import { renderMarkup } from './js/renderMarkup'
import cards from "./templates/cards.hbs"
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";


let query = '';
let page = 1;
const perPage = 40;


const searchForm = document.querySelector('.search-form')
const gallery = document.querySelector('.gallery')
const loadMore = document.querySelector('.btn-load-more')

searchForm.addEventListener('submit', onSubmit);

async function onSubmit(evt) {
    evt.preventDefault();
    query = evt.currentTarget.searchQuery.value.trim()
    gallery.innerHTML = '';
    
    if (query === '') {
    return;
    }
    
    await searchApi(query, page, perPage)
        .then(data => {
            if (data.totalHits === 0) {
                Notify.failure('Sorry, there are no images matching your search query. Please try again.')
            }
            else {
                const markup = cards(data.hits)
                gallery.insertAdjacentHTML('beforeend', markup)
                smoothScroll()
                Notify.success(`Hooray! We found ${data.totalHits} images.`)
                let simpleLightBox = new SimpleLightbox('.gallery a').refresh()
                
                if (data.totalHits > perPage) {                  
                    loadMore.classList.remove('is-hidden')
                }
            }
        }).catch(error => console.log(error))
  
}
loadMore.addEventListener('click',onLoadMore)

async function onLoadMore(evt) {
    page += 1
    await searchApi(query, page, perPage)
        .then(data => {
            const markup = cards(data.hits)
            gallery.insertAdjacentHTML('beforeend', markup)
            smoothScroll()
            let simpleLightBox = new SimpleLightbox('.gallery a').refresh()
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