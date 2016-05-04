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

  /** @type {Array.<Object>} */
  var filteredPictures = [];

  /** @constant {number} */
  var PAGE_SIZE = 12;

  /** @type {number} */
  var pageNumber = 0;

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

    container.appendChild(pictureElement);
    return pictureElement;
  };

  picturesContainer.classList.add('pictures-loading');

  /**
   * @param {Array} filteredPictures
   * @param {number} page
   * @param {number} pageSize
   * @return {boolean}
   */
  var isNextPageAvailable = function(filteredPictures, page, pageSize) {
    return page < Math.floor(filteredPictures.length / pageSize);
  };

  /** @return {boolean} */
  var isBottomReached = function() {
    var GAP = 100;
    var picturesContainerRect = picturesContainer.getBoundingClientRect();
    return window.innerHeight - picturesContainerRect.bottom - GAP >= 0;
  };

  /** @param {Array.<Object>} filteredPictures
   *  @param {number} page
   *  @param {boolean=} replace
   */
  var renderPictures = function(filteredPictures, page, replace) {
    if (replace) {
      picturesContainer.innerHTML = '';
    }

    var from = page * PAGE_SIZE;
    var to = from + PAGE_SIZE;

    filteredPictures.slice(from, to).forEach(function(picture) {
      getPictureElement(picture, picturesContainer);
    });
  };

  /** @param {boolean} reset */
  var renderNextPages = function(reset) {
    if (reset) {
      pageNumber = 0;
      picturesContainer.innerHTML = '';
    }
    while(isBottomReached() &&
    isNextPageAvailable(pictures, pageNumber, PAGE_SIZE)) {
      renderPictures(filteredPictures, pageNumber);
      pageNumber++;
    }
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
    filteredPictures = getFilteredPictures(pictures, filter);
    renderNextPages(true);
  };

  var setFiltersEnabled = function() {
    filtersForm.addEventListener('click', function(evt) {
      if (evt.target.classList.contains('filters-radio')) {
        setFilterEnabled(evt.target.id);
      }
    });

    filtersForm.addEventListener('keydown', function(evt) {
      if (evt.target.classList.contains('filters-radio') &&
        [13, 32].indexOf(evt.keyCode) > -1) {
        evt.preventDefault();
        setFilterEnabled(evt.target.id);
      }
    });
  };

  var setScrollEnabled = function() {
    var scrollTimeout;
    window.addEventListener('scroll', function() {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(function() {
        renderNextPages();
      }, 100);
    });
  };

  /** @param {function(Array.<Object>)} callback */
  var getPictures = function(callback) {
    var xhr = new XMLHttpRequest();

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

    xhr.timeout = IMAGE_LOAD_TIMEOUT;

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
    setScrollEnabled();
  });

  filtersForm.classList.remove('hidden');

})();
