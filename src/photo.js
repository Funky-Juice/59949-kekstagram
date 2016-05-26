'use strict';

var galleryModule = require('./gallery');

var templateElement = document.querySelector('#picture-template');
var elementToClone;

if ('content' in templateElement) {
  elementToClone = templateElement.content.querySelector('.picture');
} else {
  elementToClone = templateElement.querySelector('.picture');
}

/** @constant {number} */
var IMAGE_LOAD_TIMEOUT = 10000;

/**
 * @param {Object} data
 * @param {HTMLElement} container
 * @return {HTMLElement}
 */
var getPictureElement = function(data, container) {
  var pictureElement = elementToClone.cloneNode(true);
  pictureElement.querySelector('.picture-comments').textContent = data.comments;
  pictureElement.querySelector('.picture-likes').textContent = data.likes;

  var contentImage = new Image();
  var contentLoadTimeout;

  contentImage.onload = function() {
    clearTimeout(contentLoadTimeout);

    pictureElement.querySelector('img').src = data.url;
  };

  contentImage.onerror = function() {
    pictureElement.classList.add('picture-load-failure');
  };

  contentImage.src = data.url;

  contentLoadTimeout = setTimeout(function() {
    contentImage.src = '';
    pictureElement.classList.add('picture-load-failure');
  }, IMAGE_LOAD_TIMEOUT);

  pictureElement.addEventListener('click', function(evt) {
    galleryModule.showGallery(filteredPictures.indexOf(data));
    evt.preventDefault();
  });

  container.appendChild(pictureElement);
  return pictureElement;
};

/**
 * @param {Object} data
 * @param {Number} index
 * @param {Element} container
 * @constructor
 */
var Photo = function(data, index, container) {
  this.data = data;
  this.element = getPictureElement(this.data);

  this.onPictureClick = function(evt) {
    galleryModule.showGallery(index);
    evt.preventDefault();
  };

  this.remove = function() {
    this.element.removeEventListener('click', this.onPictureClick);
    this.element.parentNode.removeChild(this.element);
  };

  this.element.addEventListener('click', this.onPictureClick);
  container.appendChild(this.element);
};

module.exports = Photo;
