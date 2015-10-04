'use strict';
var _ = require('underscore');
var seatsDatas = require('./seats.json');

/*
 * As we don't have a real Database, I'm using the same localStorage key (e.g. 'CAR_SEATS').
 * This is for purpose only, to keep the app a bit closer to the reality.
 * setTimeouts are present to fake a timed server response.
 * In real prod environnement, we could use XHR using promises or callbacks.
 * I created a JSON object with each seat ID and status.
 */

var serverPing = 500; // ms

function returnJSON() {
    return localStorage.getItem('CAR_SEATS');
}

function getSeats(carID, callback) {
    if(callback){
        setTimeout(function() {
            callback( returnJSON(carID) );
        }, serverPing);
    }
}

function isSeatEmpty(seat) {
    return seat.status === 0;
}

/*
 * Returns a seat object from the stored json
 */
function getSeatByID(from, seatID) {
    for(var i = 0, l = from.length; i<l; i++){
        if(seatID === from[i].id){
            return from[i];
        }
    }
}

/*
 * This function check availability for requested seats
 * @param: [Object]
 * returns: 'Success' or 'Error'
 */
function setSeats(seats, callback) {

    var currentSeats = JSON.parse( returnJSON() );

    // For each requested seat, ask for seat status
    var availableSeats = [];
    _.each(seats, function(seat) {
        var databaseSeat = getSeatByID(currentSeats, seat.id);
        if(isSeatEmpty( databaseSeat) ){
            availableSeats.push(databaseSeat);
        }
    });

    // If one or more seat isn't available, we return an error
    if(availableSeats.length !== seats.length){
        setTimeout(function() {
            callback({
                code: "error"
            });
        }, serverPing);
        return false;
    }

    // If all seats available, let's change the status to booked!
    _.each(availableSeats, function(seat) {
        currentSeats[currentSeats.indexOf(seat)].status = 2;
    });

    localStorage.setItem('CAR_SEATS', JSON.stringify(currentSeats));

    setTimeout(function() {
        callback({
            code: "success",
            seats: _.map(availableSeats, _.clone)
        });
    }, serverPing);

}

// On first load, set up a new car in our database for example only
if( !returnJSON() ){
    localStorage.setItem('CAR_SEATS', JSON.stringify(seatsDatas));
}

module.exports = {
    getSeats: getSeats,
    setSeats: setSeats
};