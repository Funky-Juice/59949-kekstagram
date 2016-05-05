'use strict';

/** @enum {number} */
var Action = {
  ERROR: 0,
  UPLOADING: 1,
  CUSTOM: 2
};

/**
 * Форма загрузки изображения.
 * @type {HTMLFormElement}
 */
var uploadForm = document.forms['upload-select-image'];

/**
 * @type {HTMLElement}
 */
var uploadMessage = document.querySelector('.upload-message');

/**
 * @param {Action} action
 * @param {string=} message
 * @return {Element}
 */
function showMessage(action, message) {
  var isError = false;

  switch (action) {
    case Action.UPLOADING:
      message = message || 'Кексограмим&hellip;';
      break;

    case Action.ERROR:
      isError = true;
      message = message || 'Неподдерживаемый формат файла<br> <a href="' + document.location + '">Попробовать еще раз</a>.';
      break;
  }

  uploadMessage.querySelector('.upload-message-container').innerHTML = message;
  uploadMessage.classList.remove('invisible');
  uploadMessage.classList.toggle('upload-message-error', isError);
  return uploadMessage;
}

function showUploadingMsg() {
  showMessage(Action.UPLOADING);
}

function showErrorMsg() {
  showMessage(Action.ERROR);
}

function hideMessage() {
  uploadMessage.classList.add('invisible');
}

module.exports = {
  uploadForm: uploadForm,
  showUploadingMsg: showUploadingMsg,
  showErrorMsg: showErrorMsg,
  hideMessage: hideMessage
};
