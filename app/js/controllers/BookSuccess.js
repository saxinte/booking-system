'use strict';

module.exports = (function(global, doc, undefined) {

    var displaySuccess = function(htmlMessage) {

        // Display thanks message + seats infos
        view.innerHTML = '<header class="main-header page-wrap cf"><h1 class="main-title">Thank you</h1><a href="./index.html" class="button button--primary" role="button">Back to home</a>' + htmlMessage + '</header>';

    };

    /* Private vars */
    var view = document.getElementById('view');

    return {
        displayMessage: displaySuccess
    }

})(window, document);