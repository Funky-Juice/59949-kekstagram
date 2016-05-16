'use strict';

var Resizer = require('../resizer');

var utilities = require('../utilities');

var uploadModule = require('./upload-form');

/**
 * Форма кадрирования изображения.
 * @type {HTMLFormElement}
 */
var resizeForm = document.forms['upload-resize'];
var resizeX = document.querySelector('#resize-x');
var resizeY = document.querySelector('#resize-y');
var resizeSize = document.querySelector('#resize-size');
var resizeFwd = document.querySelector('#resize-fwd');

resizeX.value = 0;
resizeY.value = 0;
resizeSize.value = 200;

/**
 * Объект, который занимается кадрированием изображения.
 * @type {Resizer}
 */
var currentResizer;

/**
 * Удаляет текущий объект {@link Resizer}, чтобы создать новый с другим
 * изображением.
 */
function cleanupResizer() {
  if (currentResizer) {
    currentResizer.remove();
    currentResizer = null;
  }
}
cleanupResizer();

/**
 * Обработчик изменения изображения в форме загрузки. Если загруженный
 * файл является изображением, считывается исходник картинки, создается
 * Resizer с загруженной картинкой, добавляется в форму кадрирования
 * и показывается форма кадрирования.
 * @param {Event} evt
 */
uploadModule.uploadForm.addEventListener('change', function(evt) {
  var element = evt.target;
  if (element.id === 'upload-file') {
    // Проверка типа загружаемого файла, тип должен быть изображением
    // одного из форматов: JPEG, PNG, GIF или SVG.
    if (utilities.isImgFile(element.files[0].type)) {
      var fileReader = new FileReader();

      uploadModule.showUploadingMsg();

      fileReader.onload = function() {
        cleanupResizer();

        currentResizer = new Resizer(fileReader.result);
        currentResizer.setElement(resizeForm);

        uploadModule.uploadForm.classList.add('invisible');
        resizeForm.classList.remove('invisible');
        uploadModule.hideMessage();
      };

      fileReader.readAsDataURL(element.files[0]);
    } else {
      // Показ сообщения об ошибке, если загружаемый файл, не является
      // поддерживаемым изображением.
      uploadModule.showErrorMsg();
    }
  }
});

/**
 * Проверяет, валидны ли данные, в форме кадрирования.
 * @return {boolean}
 */
function resizeFormIsValid() {
  if ((+resizeX.value + +resizeSize.value < currentResizer._image.naturalWidth)
    && (+resizeY.value + +resizeSize.value < currentResizer._image.naturalHeight)
    && (resizeX.value >= 0 && resizeY.value >= 0)) {
    resizeFwd.removeAttribute('disabled');
    return true;
  } else {
    resizeFwd.setAttribute('disabled', 'disabled');
    return false;
  }
}

/**
 * Функция возвращает адрес обрезанной картинки из ресайзера
 */
function exportImageFromResizer() {
  return currentResizer.exportImage().src;
}

/**
 * Перерисовка currentResiser по изменению значений полей формы.
 */
resizeX.addEventListener('input', resizeFormIsValid);

resizeY.addEventListener('input', resizeFormIsValid);

resizeSize.addEventListener('input', resizeFormIsValid);

resizeForm.addEventListener('input', function() {
  currentResizer.setConstraint(parseInt(resizeX.value, 10), parseInt(resizeY.value, 10), parseInt(resizeSize.value, 10));
});

/** Изменение значений полей по перетаскиванию изображения мышью. */
window.addEventListener('resizerchange', function() {
  var squareObj = currentResizer.getConstraint();
  resizeSize.value = squareObj.side;
  resizeX.value = squareObj.x;
  resizeY.value = squareObj.y;
});

/** Проверка валидности данных в форме кадрирования. */
window.addEventListener('resizerchange', resizeFormIsValid);

module.exports = {
  resizeForm: resizeForm,
  cleanupResizer: cleanupResizer,
  resizeFormIsValid: resizeFormIsValid,
  exportImageFromResizer: exportImageFromResizer
};
