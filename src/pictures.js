'use strict';

(function() {

  var filtersForm = document.querySelector('.filters');

  filtersForm.classList.add('hidden');

  var picturesContainer = document.querySelector('.pictures');

  var templateElement = document.querySelector('#picture-template');

  if ('content' in templateElement) {
    var elementToClone = templateElement.content.querySelector('.picture');
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

    container.appendChild(pictureElement);

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

    return pictureElement;
  };

  window.pictures.forEach(function(picture) {
    getPictureElement(picture, picturesContainer);
  });

  filtersForm.classList.remove('hidden');
})();
