//testing of devicelist

const fs = require('fs'); //required for read mock xml

const expect = require('chai').expect

var fritzapi = require('fritzapi');

//overlaod xml function with stub read file expected in options.xmlFile
fritzapi.getDeviceListInfo = function(sid, options) {
    var content;
    if (options && options.xmlFile) {
        content = fs.readFile(options.xmlFile, 'utf8', function (err,data) {
          if (err) {
            return 'Error occured during read of ' + xmlFile; //error in content, so later cont will abort...;
          }
          return data;
        });
    } else {
        content = 'Missing paramter: Stub needs file in options.xmlFile';
    }
    return Promise.resolve(content);
}


describe('devicelist', function () {
    it('get stub', function * () {
        var options; options.xmlFile = './devicelist_stub.xml';
        var devicelist = fritzapi.getDeviceList(null, options);
        devicelist.version.should.eventually.equal('1');
    })
    
    it('get cached stub', function * () {
        var options; options.xmlFile = './devicelist_cache_stub.xml';
        fritzapi.getDeviceList(null, options).then(function(devicelist) {
            expect(devicelist.version).to.equal('cached');
        });
    })
})