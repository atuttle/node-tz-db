var tz     = require('../index')
	,expect = require('expect.js')
	;

describe("tz-db", function(){

	describe("zones", function(){

		it("should be an array", function(done){
			expect(tz.zones).to.be.an('array');
			done();
		});

		it("should have 548 values", function(done){
			expect(tz.zones.length).to.be(548);
			done();
		});

		it("should be sorted", function(){
			expect(tz.zones[407]).to.be('Europe/London');
		});

	});

	describe("tz", function(){

		it("should be an object", function(){
			expect(tz.tz).to.be.an('object');
		});

		it("should have some correct offsets", function(){

			expect(tz.tz['America/New_York'].std).to.be('−05:00');
			expect(tz.tz['America/New_York'].dst).to.be('−04:00');

			expect(tz.tz['Europe/Brussels'].std).to.be('+01:00');
			expect(tz.tz['Europe/Brussels'].dst).to.be('+02:00');

			expect(tz.tz['Indian/Cocos'].std).to.be('+06:30');
			expect(tz.tz['Indian/Cocos'].dst).to.be('+06:30');

		});

	});

});
