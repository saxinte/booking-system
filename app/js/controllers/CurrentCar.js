'use strict';
var _ = require('underscore');
var Apollo = require('../utils/Apollo.js');
var Car = require('../components/Car.js');

module.exports = (function(global, doc, undefined) {

    /*
     * Remove all seats from the car
     * @param: [DOM element]
     */
    var removeSeats = function(element) {
        element.innerHTML = '';
    };

    /*
     * Return a DOM element
     * @param: [Object]
     */
    var createSeatElement = function(seat) {
        var div = doc.createElement('div');
        var className = null;

        // Status codes to classnames 
        switch(seat.status){
            case 0:
                className = 'booking-view__seat-container';
            break;
            case 1:
                className = 'booking-view__seat-container requested';
            break;
            case 2:
                className = 'booking-view__seat-container booked';
            break;
        }

        div.className = className;
        div.id = seat.id;
        div.innerHTML = '<span class="booking-view__seat">'+seat.id+'</span>';
        return div;
    };

    /*
     * Inject seats in a given car
     * @param: [DOM element, Array, Integer]
     */
    var displaySeats = function(where, seats, seatsPerRow) {

        removeSeats(where);

        // Create new elements in a fragment and then append it
        var fragment = doc.createDocumentFragment();

        _.each(seats, function(seat, index) {

            // Check when we have to create the next row
            var _nextRow = (index % seatsPerRow) === 0;
            if( (index !== 0) && _nextRow){
                var sep = doc.createElement('span');
                sep.className = 'booking-view__split';
                fragment.appendChild(sep);
            }

            fragment.appendChild( createSeatElement(seat) );

        });

        where.appendChild(fragment);

    };

    /*
     * Set seats in the database
     */
    var sendRequestedSeats = function(callback) {
        CarInstance.requestSeats(selectedSeats, callback);
    };

    /*
     * Display requested seats in current car
     * @param: [Integer]
     */
    var requestSeats = function(number) {

        selectedSeats.length = 0; // reset selected seat on each new request

        var seats = _.map(CarInstance.seats, _.clone),
            foundsCounter = 0;

        for(var i = 0, l = seats.length; i<l; i++){

            if(foundsCounter === number){
                break;
            }

            var status = seats[i].status;
            if(status === 0){
                seats[i].status = 1;
                selectedSeats.push(seats[i]);
                foundsCounter++;
            }
        }

        displaySeats(trainCar, seats, CarInstance.options.seatsPerRow);

    };

    var requestSeatsManually = function(number) {

        for(var i = 0, l = seatsClone.length; i<l; i++){
            if( (seatsClone[i].status === 0) && (seatsClone[i].id === number) ){
                seatsClone[i].status = 1;
                selectedSeats.push(seatsClone[i]);
                break;
            }
        }
        displaySeats(trainCar, seatsClone, CarInstance.options.seatsPerRow);

    };

    /*
     * This callback is fired when car datas are ready
     */
    var onCarReady = function(instance) {
        CarInstance = instance;
        seatsClone = _.map(CarInstance.seats, _.clone);
        displaySeats(trainCar, CarInstance.seats, CarInstance.options.seatsPerRow);
        Apollo.removeClass(trainCar, 'booking-view__car--loading');
    };

    var init = function() {

        if(!trainCar){
            throw new Error('Car element not found, abort injection.');
        }

        // If car element is found, let's create a Car instance
        Car.create( trainCar.getAttribute('data-id'), {
            onCarReady: onCarReady
        });

    };

    // Private vars
    var CarInstance = null;
    var selectedSeats = [];
    var seatsClone = [];
    var trainCar = doc.getElementById('train-car');

    return {
        init: init,
        requestSeats: requestSeats,
        sendRequestedSeats: sendRequestedSeats,
        requestSeatsManually: requestSeatsManually
    }

})(window, document);

