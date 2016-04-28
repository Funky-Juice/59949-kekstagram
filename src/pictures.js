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

  /** @constant {string} */
  var PICTURES_LOAD_URL = '//o0.github.io/assets/json/pictures.json';

  /** @type {Array.<Object>} */
  var pictures = [];

  /** @enum {number} */
  var Filter = {
    'POPULAR': 'filter-popular',
    'NEW': 'filter-new',
    'DISCUSSED': 'filter-discussed'
  };

  /** @constant {Filter} */
  var DEFAULT_FILTER = Filter.POPULAR;

  /** @constant {number} */
  var DAYS_COUNT = 14;

  /**
   * @param {Object} data
   * @param {HTMLElement} container
   * @return {HTMLElement}
   */
  var getPictureElement = function(data, container) {
    var pictureElement = elementToClone.cloneNode(true);

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

    container.appendChild(pictureElement);
    return pictureElement;
  };

  picturesContainer.classList.add('pictures-loading');

  /** @param {Array.<Object>} filteredPictures */
  var renderPictures = function(filteredPictures) {
    picturesContainer.innerHTML = '';

    filteredPictures.forEach(function(picture) {
      getPictureElement(picture, picturesContainer);
    });
  };

  /**
   * @param {Array.<Object>} sortPictures
   * @param {Filter} filter
   */
  var getFilteredPictures = function(sortPictures, filter) {
    var picturesToFilter = sortPictures.slice(0);

    switch (filter) {
      case Filter.NEW:
        var daysFilterCount = new Date();
        daysFilterCount.setDate(daysFilterCount.getDate() - DAYS_COUNT);
        picturesToFilter = picturesToFilter.filter(function(y) {
          return Date.parse(y.date) - daysFilterCount > 0;
        }).sort(function(a, b) {
          return Date.parse(b.date) - Date.parse(a.date);
        });
        break;

      case Filter.DISCUSSED:
        picturesToFilter.sort(function(a, b) {
          return b.comments - a.comments;
        });
        break;
    }

    return picturesToFilter;
  };

  /** @param {Filter} filter */
  var setFilterEnabled = function(filter) {
    var filteredPictures = getFilteredPictures(pictures, filter);
    renderPictures(filteredPictures);
  };

  var setFiltersEnabled = function() {
    var filters = filtersForm.querySelectorAll('.filters-radio');
    for (var i = 0; i < filters.length; i++) {
      filters[i].onclick = function() {
        setFilterEnabled(this.id);
      };
    }
  };

  /** @param {function(Array.<Object>)} callback */
  var getPictures = function(callback) {
    var xhr = new XMLHttpRequest();

    xhr.timeout = IMAGE_LOAD_TIMEOUT;

    /** @param {ProgressEvent} */
    xhr.onload = function(evt) {
      var loadedData = JSON.parse(evt.target.response);
      callback(loadedData);
      picturesContainer.classList.remove('pictures-loading');
    };

    xhr.onerror = function() {
      picturesContainer.classList.add('pictures-failure');
      picturesContainer.classList.remove('pictures-loading');
    };

    xhr.ontimeout = function() {
      picturesContainer.classList.add('pictures-failure');
      picturesContainer.classList.remove('pictures-loading');
    };

    xhr.open('GET', PICTURES_LOAD_URL, true);
    xhr.send();
  };

  getPictures(function(loadedPictures) {
    pictures = loadedPictures;
    setFiltersEnabled();
    setFilterEnabled(DEFAULT_FILTER);
  });

  filtersForm.classList.remove('hidden');
})();
