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
        if(selectedSeats.length){
            CarInstance.requestSeats(selectedSeats, callback);
        }else {
            callback({
                code: 'error'
            })
        }
    };

    /*
     * Store/Delete selected seats
     */
    var storeSeat = function(seatObject) {
        seatObject.status = 1;
        selectedSeats.push(seatObject);
    };

    var deleteSeat = function(seatObject) {
        var found = selectedSeats.indexOf(seatObject);
        if(found !== -1){
            selectedSeats.splice(found, 1);
        }
    };

    var isSeatEmpty = function(seatObject) {
        return seatObject.status === 0;
    };

    /*
     * Display requested seats in current car from dropdown list
     * @param: [Integer]
     */
    var requestSeats = function(number) {

        selectedSeats.length = 0; // reset selected seat on each new request
        seatsCloneAuto = createCloneSeats(CarInstance.seats); // create a new temporary seat view

        if(number > 0){
            var foundsCounter = 0;
            for(var i = 0, l = seatsCloneAuto.length; i<l; i++){

                if(foundsCounter === number){
                    break;
                }

                var empty = isSeatEmpty(seatsCloneAuto[i]);
                if(empty){
                    storeSeat(seatsCloneAuto[i]);
                    foundsCounter++;
                }

            }
        }

        displaySeats(trainCar, seatsCloneAuto, CarInstance.options.seatsPerRow);

    };

    /*
     * Display clicked selected seats from the carriage
     * @param: [Integer]
     */
    var requestSeatsManually = function(number) {

        // if previous seats was requested using dropdow, reset
        if(seatsCloneAuto.length){
            selectedSeats.length = 0; 
            seatsCloneAuto.length = 0;
            seatsCloneManual = createCloneSeats();
        }

        for(var i = 0, l = seatsCloneManual.length; i<l; i++){

            // Find seat in carriage
            if(seatsCloneManual[i].id === number){

                var empty = isSeatEmpty(seatsCloneManual[i]);

                // Store it, if empty
                if(empty){
                    storeSeat(seatsCloneManual[i]);

                // If unselected, unstore it
                }else if(seatsCloneManual[i].status === 1){
                    seatsCloneManual[i].status = 0;
                    deleteSeat(seatsCloneManual[i]);
                }

                break; // Seat has been found
            }
            
        }

        displaySeats(trainCar, seatsCloneManual, CarInstance.options.seatsPerRow);

    };

    /*
     * Returns a clone of current database seats
     * @param: [Array]
     */
    var createCloneSeats = function() {
        return _.map(CarInstance.seats, _.clone);
    };

    /*
     * This callback is fired when car datas are ready
     */
    var onCarReady = function(instance) {
        CarInstance = instance;
        seatsCloneManual = createCloneSeats();
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
    var CarInstance = null,
        selectedSeats = [],
        seatsCloneManual = [],
        seatsCloneAuto = [],
        trainCar = doc.getElementById('train-car');

    return {
        init: init,
        requestSeats: requestSeats,
        sendRequestedSeats: sendRequestedSeats,
        requestSeatsManually: requestSeatsManually
    }

})(window, document);

