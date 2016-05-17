'use strict';

var galleryContainer = document.querySelector('.gallery-overlay');
var closeElement = galleryContainer.querySelector('.gallery-overlay-close');
var preview = galleryContainer.querySelector('.gallery-overlay-image');
var comment = galleryContainer.querySelector('.comments-count');
var like = galleryContainer.querySelector('.likes-count');

/** @type {Array.<string>} */
var galleryPictures = [];

var currentIndex = 0;

/** @param {Array.<Object>} arrayOfPictures */
var savePicturesArray = function(arrayOfPictures) {
  galleryPictures = arrayOfPictures;
};

/**
 * Отрисовка картинки по индексу
 * @param {number} index
 */
var renderPreview = function(index) {
  currentIndex = index;
  var picture = galleryPictures[index];
  preview.src = picture.url;
  comment.textContent = picture.comments;
  like.textContent = picture.likes;
};

/** @param {number} index */
var showGallery = function(index) {
  renderPreview(index);

  preview.addEventListener('click', _onPhotoClick);
  closeElement.addEventListener('click', hideGallery);
  galleryContainer.addEventListener('click', _onOverlayClick);
  window.addEventListener('keydown', _onDocumentKeyDown);

  galleryContainer.classList.remove('invisible');
};

var hideGallery = function() {
  galleryContainer.classList.add('invisible');
  preview.removeEventListener('click', _onPhotoClick);
  closeElement.removeEventListener('click', hideGallery);
  galleryContainer.removeEventListener('click', _onOverlayClick);
  window.removeEventListener('keydown', _onDocumentKeyDown);
};

var _onPhotoClick = function() {
  renderPreview(++currentIndex);
};

var _onDocumentKeyDown = function(evt) {
  if (evt.keyCode === 27) {
    evt.preventDefault();
    hideGallery();
  }
};

var _onOverlayClick = function(evt) {
  if (evt.target.classList.contains('gallery-overlay')) {
    hideGallery();
  }
};

module.exports = {
  showGallery: showGallery,
  savePicturesArray: savePicturesArray
};
