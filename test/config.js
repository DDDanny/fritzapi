"use strict";
/* jshint esversion: 6 */
/* jslint node: true */
/*global describe, it, before, beforeEach, after, afterEach */

/*  This test defines the expected test results for the three supported test types
 *  - dev (default): test runs by usage of devicelist_static.xml
 *  - custom: test runs by usage of devicelist_custom.xml
 *  - live: test runs against given fritzbox
 */

//availible testmodes (no enum yet...)
const DEV    = 'dev';
const CUSTOM = 'custom';
const LIVE   = 'live';

var MODE = DEV; //2do set cmd args

var TEST_MATRIX;

module.exports.cfgTestMatrix = () => {
    /* cfg: CUSTOM
     * align this data to your custom devicelist
     **************/
    TEST_MATRIX[CUSTOM].xmlFile = './test/devicelist_custom.xml';
    TEST_MATRIX[CUSTOM].devicelist.version = '1';

    /* cfg: LIVE
     **********/
    //live test is same as custom test by default, 
    // => fritz.box should behave like your custom prepared expectations
    TEST_MATRIX[LIVE] = TEST_MATRIX[CUSTOM];
    TEST_MATRIX[LIVE].user = 'fritzapi'; //smarthome rights for AHA tests // admin rights for wlan, batterylevel
    TEST_MATRIX[LIVE].pwd = 'fritzapi';
    TEST_MATRIX[LIVE].options = { url: 'https://fritz.box', strictSSL: false }; //allow self signed certificates

    /* cfg: DEV
     * please do not change
     **************/
    TEST_MATRIX[DEV].devicelist.version = 'develop';
    TEST_MATRIX[DEV].xmlFile = './test/devicelist_dev.xml';
};

initTestMatrix();
module.exports.cfgTestMatrix();

/*
 * test setup
 ***************/
const sinon = require('sinon');

const bluebird = require('bluebird');
const fritzapi = require('../index');

beforeEach(function () {
    sinon.sandbox.create();
    if (MODE != LIVE) {
        if (TEST_MATRIX[MODE].xmlFile) { //stub result with given xml
            devicelistSinon = sinon.sandbox.stub(fritzapi, 'getDeviceListInfo').usingPromise(bluebird.Promise).resolves(loadStubDevicelistInfoXML(TEST_MATRIX[MODE].xmlFile)); //stub api result
        } else { //no XML...
            throw new Error('config.js: No XML file defined... aborting');
        }
    } else { //live test - install spy
        devicelistSinon = sinon.sandbox.spy(fritzapi, 'getDeviceListInfo');
    }
});

afterEach(function () {
  sinon.sandbox.restore();
});

/*
 * test helpers
 *************/

var devicelistSinon = {};

//get devicelistSinon
module.exports.getDevicelistInfoSinon = () => {
    return devicelistSinon;
};

module.exports.isDevTest = () => {
    return MODE === DEV;
};

module.exports.isCustomTest = () => {
    return MODE === CUSTOM;
};

module.exports.isLiveTest = () => {
    return MODE === LIVE;
};

module.exports.getTestmode = () => {
    return MODE;
};

//pass the path to read as array
module.exports.readValue = (pathArr) => {
    return readValueByPath(TEST_MATRIX[MODE], pathArr);
};
/*
 * internals
 *************/

// retrieve testmartix value from path by endrecursion
function readValueByPath(tm, pathArr) {
    return pathArr.length ? /*still work:*/ readValueByPath(tm[pathArr.shift()], pathArr) : /*got it*/ tm;
}
 
 // prepare globals
function initTestMatrix() {
    TEST_MATRIX = {}; 
    TEST_MATRIX.mode = DEV; //2do get via cmd args
    TEST_MATRIX.devicelistXMLFile = '';

    TEST_MATRIX[LIVE] = {};
    TEST_MATRIX[CUSTOM] = {};
    TEST_MATRIX[DEV] = {};

    //setting up test matrix objects
    [TEST_MATRIX[DEV], TEST_MATRIX[LIVE], TEST_MATRIX[CUSTOM] ].forEach(function(o) {
        o.devicelist = {};
    });
}
 
//sync loader for test xml file(s) to stub diffrent scenarios
function loadStubDevicelistInfoXML(file)
{
    const FS = require('fs'); //required for read mock xml
    return FS.readFileSync(file, {encoding: 'utf-8'});
}