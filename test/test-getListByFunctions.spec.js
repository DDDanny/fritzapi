/*
//testing of getListByFunctions 
const chai = require('chai');
var fritzapi = require('../fritzapi');

describe('getListByFunction', function () {
    it('undefined bit => empty list', function * () {
        fritzapi.getListByFunction(undefined, undefined, undefined).should.eventually.be.an('array').should.eventually.be.empty;
    })
    
    it('0 bits => empty list', function * () {
        fritzapi.getListByFunction(undefined, 0, undefined).then(function(devicelist) {
            devicelist.should.be.an('array').that.should.be.empty;
        });
    })
})
*/