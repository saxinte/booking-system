/* JavaScript Tests
--------------------------- */

describe('Car.js Component', function(){

    var Car = require('../app/js/components/Car.js');   

    it('Should create a Car instance', function(){
        var instance = Car.create('test');
        expect(instance).to.be.ok();
        expect(instance.carID).to.be('test');
    });

    it('Should overwrite option', function(){
        var instance = Car.create('test', {
            seatsPerRow: 10
        });
        expect(instance.options.seatsPerRow).to.be(10);
    });

    it('Should fire a callback', function(done) {
        var instance = Car.create('test', {
            onCarReady: function() {
                done();
            }
        });
    });

    it('Should return 14 rows (67 seats, 5 per row)', function(){
        var instance = Car.create('test');
        instance.seatsNumber = 67;
        expect(instance.getRows()).to.be(14);
    });

    it('Should return 11 rows (43 seats, 4 per row)', function(){
        var instance = Car.create('test', {
            seatsPerRow: 4
        });
        instance.seatsNumber = 43;
        expect(instance.getRows()).to.be(11);
    });

    it('Should return 1 row (100 seats, 100 per row)', function(){
        var instance = Car.create('test', {
            seatsPerRow: 100
        });
        instance.seatsNumber = 100;
        expect(instance.getRows()).to.be(1);
    });

});
