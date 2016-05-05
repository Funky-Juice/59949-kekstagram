'use strict';

var uploadModule = require('./upload-form');
var resizeModule = require('./resize-form');
var filterModule = require('./filter-form');

/**
 * @type {HTMLElement}
 */
var backgroundElement = document.querySelector('.upload');

var images = [
  'img/logo-background-1.jpg',
  'img/logo-background-2.jpg',
  'img/logo-background-3.jpg'
];

/**
 * Ставит одну из трех случайных картинок на фон формы загрузки.
 */
function updateBackground() {
  var randomImageNumber = Math.round(Math.random() * (images.length - 1));
  backgroundElement.style.backgroundImage = 'url(' + images[randomImageNumber] + ')';
}

updateBackground();

/**
 * Обработка сброса формы кадрирования. Возвращает в начальное состояние
 * и обновляет фон.
 * @param {Event} evt
 */
resizeModule.resizeForm.addEventListener('reset', function(evt) {
  evt.preventDefault();

  resizeModule.cleanupResizer();
  updateBackground();

  resizeModule.resizeForm.classList.add('invisible');
  resizeModule.uploadForm.classList.remove('invisible');
});

/**
 * Отправка формы фильтра. Возвращает в начальное состояние, предварительно
 * записав сохраненный фильтр в cookie.
 * @param {Event} evt
 */

filterModule.filterForm.addEventListener('submit', function(evt) {
  evt.preventDefault();

  var formattedDateToExpire = new Date(dateToExpire).toUTCString();


  filterModule.setLastFilterToCookie();

  resizeModule.cleanupResizer();
  updateBackground();

  filterModule.filterForm.classList.add('invisible');
  uploadModule.uploadForm.classList.remove('invisible');
});


