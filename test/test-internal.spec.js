"use strict";
/* jshint esversion: 6 */
/* jshint -W030 */ //allow Expected an assignment or function call and instead saw an expression
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
            var options = {url: 'this.reqÃ¶st.will.die.'}; //should run in nirvana...
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

    describe('(private) .isNumericn(n)', function () {
        var isNumeric;
        
        beforeEach(() => {
            isNumeric = fritzapi.__get__('isNumeric');
        });
        afterEach(() => {
            isNumeric = null;
        });

        const TWENTY_TWO = 42;
        const TWENTY_TWO_STR = '42';
        const MINUS_TWENTY_TWO = -42;
        const MINUS_TWENTY_TWO_STR = '-42';

        it('integer ' + TWENTY_TWO, () => {
            isNumeric(TWENTY_TWO).should.be.true;
        });
        it('integer string ' + TWENTY_TWO_STR, () => {
            isNumeric(TWENTY_TWO_STR).should.be.true;
        });
        it('integer ' + MINUS_TWENTY_TWO, () => {
            isNumeric(MINUS_TWENTY_TWO).should.be.true;
        });
        it('integer string ' + MINUS_TWENTY_TWO_STR, () => {
            isNumeric(MINUS_TWENTY_TWO_STR).should.be.true;
        });

    
        const FOURTY_ELEVEN_DOT_ELEVEN = 47.11;
        const FOURTY_ELEVEN_DOT_ELEVEN_STR = '47.11';
        const MINUS_FOURTY_ELEVEN_DOT_ELEVEN = -47.11;
        const MINUS_FOURTY_ELEVEN_DOT_ELEVEN_STR = '-47.11';

        it('floating point ' + MINUS_FOURTY_ELEVEN_DOT_ELEVEN, () => {
            isNumeric(MINUS_FOURTY_ELEVEN_DOT_ELEVEN).should.be.true;
        });
        it('floating point string ' + MINUS_FOURTY_ELEVEN_DOT_ELEVEN, () => {
            isNumeric(MINUS_FOURTY_ELEVEN_DOT_ELEVEN_STR).should.be.true;
        });
        it('floating point ' + MINUS_FOURTY_ELEVEN_DOT_ELEVEN, () => {
            isNumeric(MINUS_FOURTY_ELEVEN_DOT_ELEVEN).should.be.true;
        });
        it('floating point string ' + MINUS_FOURTY_ELEVEN_DOT_ELEVEN, () => {
            isNumeric(MINUS_FOURTY_ELEVEN_DOT_ELEVEN_STR).should.be.true;
        });
        
        const A_STRING = '42d';
        it('string ' + A_STRING + ' is not', () => {
            isNumeric(A_STRING).should.be.false;
        });
        
        it(Number.POSITIVE_INFINITY + ' is not', () => {
            isNumeric(Number.POSITIVE_INFINITY).should.be.false;
        });
        it(Number.NEGATIVE_INFINITY + ' is not', () => {
            isNumeric(Number.NEGATIVE_INFINITY).should.be.false;
        });
    });

    describe('(private) .temp2api(temp)', function () {
        var temp2api;
        
        beforeEach(() => {
            temp2api = fritzapi.__get__('temp2api');
        });
        afterEach(() => {
            temp2api = null;
        });
        
        it('on => internal ' + fritzapi.ON_TEMP, () => {
            temp2api('on').should.be.equal(fritzapi.ON_TEMP);
        });
        it('ON => internal ' + fritzapi.ON_TEMP, () => {
            temp2api('ON').should.be.equal(fritzapi.ON_TEMP);
        });
        it('AVM_TRUE => internal ' + fritzapi.ON_TEMP, () => {
            temp2api(fritzapi.AVM_TRUE).should.be.equal(fritzapi.ON_TEMP);
        });
        it('29 => on => internal ' + fritzapi.ON_TEMP, () => {
            temp2api('on').should.be.equal(fritzapi.ON_TEMP);
        });
        it('off => internal ' + fritzapi.OFF_TEMP, () => {
            temp2api('off').should.be.equal(fritzapi.OFF_TEMP);
        });
        it('OFF => internal ' + fritzapi.OFF_TEMP, () => {
            temp2api('OFF').should.be.equal(fritzapi.OFF_TEMP);
        });
        it('AVM_FALSE => internal ' + fritzapi.OFF_TEMP, () => {
            temp2api(fritzapi.AVM_FALSE).should.be.equal(fritzapi.OFF_TEMP);
        });
        it('7 => off => internal ' + fritzapi.OFF_TEMP, () => {
            temp2api('off').should.be.equal(fritzapi.OFF_TEMP);
        });
        
        const INTERNAL_14_DEGREE = 28;
        it('14°C => internal ' + INTERNAL_14_DEGREE, () => {
            temp2api(14).should.be.equal(INTERNAL_14_DEGREE);
        });

    });

    describe('(private) .api2temp(param)', function () {
        var api2temp;
        
        beforeEach(() => {
            api2temp = fritzapi.__get__('api2temp');
        });
        afterEach(() => {
            api2temp = null;
        });
        
        it('internal ' + fritzapi.ON_TEMP + ' => on', () => {
            api2temp(fritzapi.ON_TEMP).should.be.equal('on');
        });
        it('internal ' + fritzapi.OFF_TEMP + ' => off', () => {
            api2temp(fritzapi.OFF_TEMP).should.be.equal('off');
        });
        
        const INTERNAL_14_DEGREE = 28;
        it('internal ' + INTERNAL_14_DEGREE + ' => 14°C', () => {
            api2temp(INTERNAL_14_DEGREE).should.be.equal(14);
        });

    });
});
