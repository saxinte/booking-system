'use strict';
var _ = require('underscore');
var database = require('../datas/fake-database.js');

function Car(id, options) {

    if(!id){
        throw new Error("Car needs an ID");
        return false;
    }

    this.defaultOptions = {
        onCarReady: null,
        seatsPerRow: 5
    };

    this.carID = id;
    this.options = _.extend(this.defaultOptions, options);

    // Let's find seats from a given Car ID
    database.getSeats(this.carID, _.bind(function(seats) {

        this.seats = JSON.parse(seats);
        this.seatsNumber = this.seats.length;

        // Find how many rows are needed for this Car
        this.carRows = this.getRows();

        // If a callback was requested, fire it
        if(this.options.onCarReady){
            this.options.onCarReady(this);
        }

    }, this));
    
}

Car.prototype.requestSeats = function(seats, callback) {
    database.setSeats(seats, callback);
};

Car.prototype.getRows = function() {
    var remainingSeats = this.getLastRowSeats();
    if(remainingSeats > 0){
        return ( (this.seatsNumber - remainingSeats) / this.options.seatsPerRow) + 1; // 1 is the additional row for the remaining seats
    }
    return (this.seatsNumber / this.options.seatsPerRow);
};

/*
 * Return how many seats are remaining alone (not in a full row)
 */
Car.prototype.getLastRowSeats = function() {
    return this.seatsNumber % this.options.seatsPerRow;
};

module.exports = {
    create: function(id, options) {
        return new Car(id, options);
    }
};