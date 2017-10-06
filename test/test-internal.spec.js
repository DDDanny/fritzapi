"use strict";
/* jshint esversion: 6 */
/* jslint node: true */
/*global describe, it, before, beforeEach, after, afterEach */

/* 
    testing of central internal used functions
    via rewire
*/

const cfg = require('./config');

const sinon = require('sinon');

const chai = require('chai');
chai.use(require('chai-as-promised'));
chai.use(require('chai-string'));
chai.use(require('sinon-chai'));

const rewire = require('rewire');

//rewire fritzapi and internal functions
const fritzapi = rewire('../index');

describe('internal used functions [' + cfg.getTestmode() + ']', function () {
    describe('(private) .forkDevicelist(sid, options)', function () {
        it('will use the given devicelist', () => {
            var forkDevicelist = fritzapi.__get__('forkDevicelist');
            var options = {}; options.devicelist = 'test devicelist';
            return forkDevicelist("dummy", options).should.become('test devicelist'); //no further testing as if it goes other direction then izt would never return this string...
        });
        it('will get via .getDeviceList', (done) => {
            var forkDevicelist = fritzapi.__get__('forkDevicelist');
            var options = {url: 'this.reqöst.will.die.'}; //should run in nirvana...
            forkDevicelist("invalid", options).then((devicelist) => {
                //not stubbable via require so we expect a error (data request without credentials)
                throw('Received a devicelist with invalid request' + options);
            }).then(done, (oo) => {
                oo.should.be.an("object");
                oo.error.should.be.an("error");
                oo.error.message.should.startWith("Invalid URI");
                done();
            });
        });
    });

    describe('(private) .verifySession(body)', function () {
        const VALID_SID = "1234567890123456";
        it('returns valid SID ' + VALID_SID + ' from test body', () => {
            const TEST_BODY = 'The fritz box is sending <SID>' + VALID_SID + '</SID> tag in the reply';
            const verifySession = fritzapi.__get__('verifySession');
            return verifySession(TEST_BODY).should.be.equal(VALID_SID);
        });
        it('rejects invalid SID ' + fritzapi.INVALID_SID, (done) => {
            const TEST_BODY = 'The fritz box is sending <SID>' + fritzapi.INVALID_SID + '</SID> tag in the reply';
            const verifySession = fritzapi.__get__('verifySession');
            verifySession(TEST_BODY).then((sid) => {
                //not stubbable via require so we expect a error (data request without credentials)
                throw('Received a sid, but sid was exepcted to be invalid:' + sid);
            }).then(done, (rejected) => {
                rejected.should.be.an("String");
                rejected.should.equal(fritzapi.INVALID_SID);
                done();
            });
        });
    });
});
