"use strict";
/* jshint esversion: 6 */

/* 
    testing of central internal used functions
    via rewire
*/

require('./config');

const sinon = require('sinon');

var chai = require('chai')
  ,expect = chai.expect
//  ,should = chai.should();
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);

const sinonChai = require('sinon-chai');
chai.use(sinonChai);

const rewire = require('rewire');

//rewire fritzapi and internal functions
const fritzapi = rewire('../index');

describe('(private) .forkDevicelist(sid, options)', function () {
    it('will use the given devicelist', () => {
        var forkDevicelist = fritzapi.__get__('forkDevicelist');

        var options = {}; options.devicelist = 'test devicelist';
        return forkDevicelist("dummy", options).should.become('test devicelist');
    });
});