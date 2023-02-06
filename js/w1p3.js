import fetchPhotos from './w1p3-modules.js';

let app = document.getElementById('app');
fetchPhotos(app, 'https://vanillajsacademy.com/api/photos.json');
