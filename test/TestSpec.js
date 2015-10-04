/* JavaScript Tests
--------------------------- */

describe('Output', function(){

    it('Should return a new Car Instance', function(){
        var car = new Car('test');
        expect(car).to.be.ok();
    });

    it('Should have 14 rows', function(){
        var car = new Car('test', {
            seatsPerRow: 5
        });
        expect(car.getRows()).to.equal(14);
    });

});


