import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const KEY = '29318386-adfa654ecd5a2c31c35ac8541';


export default async function searchApi(query, page, perPage) {

  return await axios.get(`${BASE_URL}`, {
      params: {
        key: `${KEY}`,
        q: `${query}`,
        image_type: "photo",
        safesearch: "true",
        orientation: "horizontal",
        page: `${page}`,
        per_page: `${perPage}`,
      },
    }).then(response => response.data);
}

