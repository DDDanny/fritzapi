"use strict";
//testing of devicelist

const bluebird = require('bluebird');
const parser = require('xml2json-light');

const sinon = require('sinon');
//var myStub = sinon.stub()
//    .usingPromise(Promise);

var chai = require('chai')
//  ,expect = chai.expect
  ,should = chai.should();
const sinonChai = require('sinon-chai');
chai.use(sinonChai);

const fs = require('fs'); //required for read mock xml

var fritzapi = require('../index');

//sync loader for test xml file(s) to stub diffrent scenarios
function loadStubDevicelistInfoXML(file)
{
    return fs.readFileSync(file, {encoding: 'utf-8'});
}


describe('.getDeviceList', function () {
    it('get stubbed version cached', (done) => {
        var XML = loadStubDevicelistInfoXML('./test/devicelist_cache_stub.xml');
        var stub = sinon.stub(fritzapi, 'getDeviceListInfo').usingPromise(bluebird.Promise).resolves(XML); //stub api result

        fritzapi.getDeviceList().then( (devicelist) => {
            devicelist.should.be.an('array');
            stub.should.have.been.calledOnce;
	    //workaround to recognize cached list via alarm (#1) named _cached_

        }).then(done, done);
    });
})