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

        // перевірка на співпаданя попереднього значення, працює у такому порядку
    if (query === evt.currentTarget.searchQuery.value.trim()) {
        Notify.failure('It`s already found.')  
    return;
    }

    query = evt.currentTarget.searchQuery.value.trim();
    
    //  тепер коли після першого сабміту на пусту строку не спрацьовує ця перевірка
    // мішав ці первірки та query, то одне то інше не справцьовує
    // але якщо після після вдалго сабміту шукати пусту строку один раз спрацьовує - Please enter some query
    
      if (query === '') {
        Notify.failure('Please enter some query.')
        return;
     }
    

    page = 1;
    gallery.innerHTML = '';
    loadMore.classList.add('is-hidden')
     
     
    try {
        const response = await searchApi(query, page, perPage);
        
        if (response.totalHits === 0) {
            Notify.failure('Sorry, there are no images matching your search query. Please try again.')
    
        }
        else {
            gallery.insertAdjacentHTML('beforeend', cards(response.hits))
            Notify.success(`Hooray! We found ${response.totalHits} images.`)
            lightbox.refresh();
            searchForm.disabled = true;

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

 async function onLoadMore(evt) {
     page += 1
     try {
        const response = await searchApi(query, page, perPage)
        
        gallery.insertAdjacentHTML('beforeend', cards(response.hits))
        smoothScroll()
        lightbox.refresh();
        const endOfSearch = Math.ceil(response.totalHits / perPage)
        if (page > endOfSearch) {                
            loadMore.classList.add('is-hidden')          
            Notify.failure('We are sorry, but you have reached the end of search results.')
        }
     }
      catch (error) {
       Notify.failure('Sorry, there are no images matching your search query. Please try again.')
    }
   
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