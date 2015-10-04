'use strict';
var CurrentCar = require('./controllers/CurrentCar.js');
var RequestSeatForm = require('./controllers/RequestSeatForm.js');

// Inject a new Car
CurrentCar.init();

// Init form controller
RequestSeatForm.init();