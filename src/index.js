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
     
     
    try {
        const response = await searchApi(query, page, perPage);
        
        if (response.totalHits === 0) {
            Notify.failure('Sorry, there are no images matching your search query. Please try again.')
            loadMore.classList.add('is-hidden')
        }
        else {
            gallery.insertAdjacentHTML('beforeend', cards(response.hits))
            Notify.success(`Hooray! We found ${response.totalHits} images.`)
            lightbox.refresh();


            if (response.totalHits > perPage) {
                loadMore.classList.remove('is-hidden')
            }
        }
    }
    catch (error) {
       Notify.failure('Sorry, there are no images matching your search query. Please try again.')
    }

  
}
loadMore.addEventListener('click',onLoadMore)

 function onLoadMore(evt) {
    page += 1
     searchApi(query, page, perPage)
    .then(data => {
        gallery.insertAdjacentHTML('beforeend', cards(data.hits))
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