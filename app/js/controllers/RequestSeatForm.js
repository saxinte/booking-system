'use strict';
var _ = require('underscore');
var Apollo = require('../utils/Apollo.js');
var Utils = require('../utils/Utils.js');
var CurrentCar = require('./CurrentCar.js');
var BookSuccess = require('./BookSuccess.js');

module.exports = (function(global, doc, undefined) {

    /*
     * Server response:
     * If success, display a message, if not, enable the form again
     */
    var serverResponse = function(response) {

        if(response.code !== 'success'){
            enableSubmit();
            return false;
        }

        var str   = '<p class="main-header__text"><strong>Infos:</strong></p>',
            count = 0;
            
        _.each(response.seats, function(seat) {
            count++; 
            str += '<p class="main-header__text">Ticket ' + count + ' - Seat number: <strong>' + seat.id + '</strong></p>';
        });
        
        BookSuccess.displayMessage('<p class="main-header__text">Thank you for ordering tickets with our service!</p>'+ str);
    };

    var disableSubmit = function() {
        submit.setAttribute('disabled', 'disabled');
        Apollo.addClass(submit, 'button--loader');
    };

    var enableSubmit = function() {
        submit.removeAttribute('disabled');
        Apollo.removeClass(submit, 'button--loader');
    };

    /*
     * On submit, wait for the server response and disable form
     */
    var submitHandler = function(e) {
        e.preventDefault();
        disableSubmit();
        CurrentCar.sendRequestedSeats(serverResponse);
    };

    var selectHandler = function() {
        var numberOfSeats = parseInt(this.value);
        if(numberOfSeats > 0){
            CurrentCar.requestSeats(numberOfSeats);
        }
    };

    var requestSeatsManually = function() {
        CurrentCar.requestSeatsManually(parseInt(this.id));
    };

    var init = function(){

        select = doc.getElementById('select-seats');
        if(select){
            select.addEventListener('change', selectHandler);
        }

        submit = doc.getElementById('submit-form');
        if(submit){
            submit.addEventListener('click', submitHandler);
        }

        var trainCar = doc.getElementById('train-car');
        Utils.delegate(trainCar, 'booking-view__seat-container', 'click', requestSeatsManually);

    };

    /* Private vars */
    var select, submit;

    return {
        init: init
    }

})(window, document);