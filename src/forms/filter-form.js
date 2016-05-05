'use strict';

var browserCookies = require('browser-cookies');

var resizeModule = require('./resize-form');

resizeModule.resizeForm.addEventListener('submit', function(evt) {
  evt.preventDefault();

  if (resizeModule.resizeFormIsValid()) {
    filterImage.src = resizeModule.currentResizer.exportImageFromResizer();

    resizeModule.resizeForm.classList.add('invisible');
    filterForm.classList.remove('invisible');
  }
});

/**
 * Форма добавления фильтра.
 * @type {HTMLFormElement}
 */
var filterForm = document.forms['upload-filter'];

/**
 * @type {Object.<string, string>}
 */
var filterMap = {
  'none': 'filter-none',
  'chrome': 'filter-chrome',
  'sepia': 'filter-sepia'
};

/**
 * @type {HTMLImageElement}
 */
var filterImage = filterForm.querySelector('.filter-image-preview');

/**
 * Сброс формы фильтра. Показывает форму кадрирования.
 * @param {Event} evt
 */
filterForm.addEventListener('reset', function(evt) {
  evt.preventDefault();

  filterForm.classList.add('invisible');
  resizeModule.resizeForm.classList.remove('invisible');
});

/** Расчет дней до истечения cookie. */
function daysToExpire() {
  var today = new Date();
  var birthYear = today.getFullYear();

  if(+today > +new Date(birthYear, 9, 13)) {
    var dateToExpire = +today + (+today - (+new Date(birthYear, 9, 13)));
  } else {
    dateToExpire = +today + (+today - (+new Date(birthYear - 1, 9, 13)));
  }

  return new Date(dateToExpire).toUTCString();
}

var formattedDateToExpire = daysToExpire();

/**
 * Функция записи последнего фильтра в cookie.
 */
function setLastFilterToCookie() {
  var chekedFilterId = function() {
    var inputField = filterForm.elements['upload-filter'];

    for (var i = 0; i < inputField.length; i++) {
      if (inputField[i].checked) {
        return inputField[i].id;
      }
    }
    return '';
  };

  browserCookies.set('selectedFilter', chekedFilterId(), {
    expires: formattedDateToExpire
  });
}

/**
 * Обработчик изменения фильтра. Добавляет класс из filterMap соответствующий
 * выбранному значению в форме.
 */
filterForm.addEventListener('change', function() {

  var selectedFilter = [].filter.call(filterForm['upload-filter'], function(item) {
    return item.checked;
  })[0].value;

  // Класс перезаписывается, а не обновляется через classList потому что нужно
  // убрать предыдущий примененный класс. Для этого нужно или запоминать его
  // состояние или просто перезаписывать.
  filterImage.className = 'filter-image-preview ' + filterMap[selectedFilter];

  setLastFilterToCookie();
});

module.exports = {
  filterForm: filterForm,
  setLastFilterToCookie: setLastFilterToCookie
};
