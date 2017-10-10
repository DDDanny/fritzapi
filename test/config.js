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

var MODE;
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
    TEST_MATRIX[LIVE].user = 'use npm test --mode live --username <username> --password <password>'; //smarthome rights for AHA tests // admin rights for wlan, batterylevel
    TEST_MATRIX[LIVE].pwd = 'use npm test --mode live --username <username> --password <password>';
    TEST_MATRIX[LIVE].options = { url: 'https://fritz.box', strictSSL: false }; //allow self signed certificates

    /* cfg: DEV
     * please do not change
     **************/
    TEST_MATRIX[DEV].devicelist.version = 'develop';
    TEST_MATRIX[DEV].xmlFile = './test/devicelist_dev.xml';

    /* 6 pysical devices: 3 heaters, 2 switches, 1 dect repeater */
    
    //3 Heaters (Vavle and temp sensor)
    TEST_MATRIX[DEV].valveActors = 
    {
        
        list: [
            {
                ain: "000000063088",
                id: "25",
                manufacturer: "AVM",
                productname: "Comet DECT",
                fwversion: "03.54",
                present: "1",
                name: "HK XXX",

                temperature: 20.5,
                offset: 0,

                lock: 0,
                devicelock: 0,

                target: 253,
                eco: 16,
                comfort: 40,
                errorcode: 0,
                batlow: 1,
                nextchange: {
                    endperiod: 0,
                    temp: 40,
                },
            },        
            {
                ain: "000000040184",
                id: "26",
                manufacturer: "AVM",
                productname: "Comet DECT",
                fwversion: "03.54",
                name: "HK YYY",
                present: "0",

                temperature: 20,
                offset: 0,

                lock: 0,
                devicelock: 0,

                target: 254,
                eco: 28,
                comfort: 40,
                errorcode: 0,
                batlow: 0,
                nextchange: {
                    endperiod: 0,
                    temp: 40,
                },
            },        
            {
                ain: "000000040185",
                id: "27",
                manufacturer: "AVM",
                productname: "Comet DECT",
                fwversion: "03.55",
                name: "HK ZZZ",
                present: "0",

                temperature: 20.1,
                offset: 0.5,

                lock: 1,
                devicelock: 0,

                target: 28,
                eco: 28,
                comfort: 40,
                errorcode: 2,
                batlow: 1,
                nextchange: {
                    endperiod: 0,
                    temp: 40,
                },
            },        
        ],
    };
    TEST_MATRIX[DEV].valveActors.ains = []; //collect alarm ains
    TEST_MATRIX[DEV].valveActors.list.forEach((valve) => {
        TEST_MATRIX[DEV].valveActors.ains.push(valve.ain);
    });

    //2 switches (temp sensor, energy meter)
    TEST_MATRIX[DEV].switchActors = 
    {
        list: [
            {
                ain: "087610000434",
                id: "17",
                manufacturer: "AVM",
                productname: "FRITZ!DECT 200",
                fwversion: "03.33",
                name: "Steckdose",
                present: "1",

                state: "1",
                mode: "auto",
                lock: "0",
                devicelock: "0",

                temperature: "285",
                offset: "0",

                power: "1234",
                energy: "707",
            },
            {
                ain: "087610000435",
                id: "18",
                manufacturer: "test",
                productname: "FRITZ!DECT 210",
                fwversion: "47.11",
                name: "Steckdose manuell offline",
                present: "0",

                state: "0",
                mode: "manuell",
                lock: "1",
                devicelock: "1",

                temperature: "160",
                offset: "0.5",

                power: "12345678",
                energy: "666",
            },
        ],
    };
    TEST_MATRIX[DEV].switchActors.ains = []; //collect switch ains
    TEST_MATRIX[DEV].switchActors.list.forEach((aswitch) => {
        TEST_MATRIX[DEV].switchActors.ains.push(aswitch.ain);
    });

    //1 dect repeater (is a temp sensor)
    TEST_MATRIX[DEV].dectRepeaters = 
    {
        list: [
            {
                ain: "087611048079",
                id: "16",
                manufacturer: "AVM",
                productname: "FRITZ!DECT Repeater 100",
                fwversion: "03.33",
                present: "1",
                temperature: 28.8,
                offset: 0,
            },
        ],
    };
    TEST_MATRIX[DEV].dectRepeaters.ains = []; //collect alarm ains
    TEST_MATRIX[DEV].dectRepeaters.list.forEach((rep) => {
        TEST_MATRIX[DEV].dectRepeaters.ains.push(rep.ain);
    });
    
    //6 tempsensors (3 vavle, 2 switch, 1 dect) //order needs to be equal as in the stubbed devicelist xml !
    TEST_MATRIX[DEV].tempSensors = 
    {
        list: [
            {
                ain: TEST_MATRIX[DEV].dectRepeaters.list[0].ain,
                id: TEST_MATRIX[DEV].dectRepeaters.list[0].id,
                manufacturer: TEST_MATRIX[DEV].dectRepeaters.list[0].manufacturer,
                productname: TEST_MATRIX[DEV].dectRepeaters.list[0].productname,
                fwversion: TEST_MATRIX[DEV].dectRepeaters.list[0].fwversion,
                name: TEST_MATRIX[DEV].dectRepeaters.list[0].name,
                present: TEST_MATRIX[DEV].dectRepeaters.list[0].present,

                temperature: TEST_MATRIX[DEV].dectRepeaters.list[0].temperature,
                offset: TEST_MATRIX[DEV].dectRepeaters.list[0].offset,
            },
            {
                ain: TEST_MATRIX[DEV].switchActors.list[0].ain,
                id: TEST_MATRIX[DEV].switchActors.list[0].id,
                manufacturer: TEST_MATRIX[DEV].switchActors.list[0].manufacturer,
                productname: TEST_MATRIX[DEV].switchActors.list[0].productname,
                fwversion: TEST_MATRIX[DEV].switchActors.list[0].fwversion,
                name: TEST_MATRIX[DEV].switchActors.list[0].name,
                present: TEST_MATRIX[DEV].switchActors.list[0].present,

                temperature: TEST_MATRIX[DEV].switchActors.list[0].temperature,
                offset: TEST_MATRIX[DEV].switchActors.list[0].offset,
            },
            {
                ain: TEST_MATRIX[DEV].switchActors.list[1].ain,
                id: TEST_MATRIX[DEV].switchActors.list[1].id,
                manufacturer: TEST_MATRIX[DEV].switchActors.list[1].manufacturer,
                productname: TEST_MATRIX[DEV].switchActors.list[1].productname,
                fwversion: TEST_MATRIX[DEV].switchActors.list[1].fwversion,
                name: TEST_MATRIX[DEV].switchActors.list[1].name,
                present: TEST_MATRIX[DEV].switchActors.list[1].present,

                temperature: TEST_MATRIX[DEV].switchActors.list[1].temperature,
                offset: TEST_MATRIX[DEV].switchActors.list[1].offset,
            },
            {
                ain: TEST_MATRIX[DEV].valveActors.list[0].ain,
                id: TEST_MATRIX[DEV].valveActors.list[0].id,
                manufacturer: TEST_MATRIX[DEV].valveActors.list[0].manufacturer,
                productname: TEST_MATRIX[DEV].valveActors.list[0].productname,
                fwversion: TEST_MATRIX[DEV].valveActors.list[0].fwversion,
                name: TEST_MATRIX[DEV].valveActors.list[0].name,
                present: TEST_MATRIX[DEV].valveActors.list[0].present,

                temperature: TEST_MATRIX[DEV].valveActors.list[0].temperature,
                offset: TEST_MATRIX[DEV].valveActors.list[0].offset,
            },
            {
                ain: TEST_MATRIX[DEV].valveActors.list[1].ain,
                id: TEST_MATRIX[DEV].valveActors.list[1].id,
                manufacturer: TEST_MATRIX[DEV].valveActors.list[1].manufacturer,
                productname: TEST_MATRIX[DEV].valveActors.list[1].productname,
                fwversion: TEST_MATRIX[DEV].valveActors.list[1].fwversion,
                name: TEST_MATRIX[DEV].valveActors.list[1].name,
                present: TEST_MATRIX[DEV].valveActors.list[1].present,

                temperature: TEST_MATRIX[DEV].valveActors.list[1].temperature,
                offset: TEST_MATRIX[DEV].valveActors.list[1].offset,
            },
            {
                ain: TEST_MATRIX[DEV].valveActors.list[2].ain,
                id: TEST_MATRIX[DEV].valveActors.list[2].id,
                manufacturer: TEST_MATRIX[DEV].valveActors.list[2].manufacturer,
                productname: TEST_MATRIX[DEV].valveActors.list[2].productname,
                fwversion: TEST_MATRIX[DEV].valveActors.list[2].fwversion,
                name: TEST_MATRIX[DEV].valveActors.list[2].name,
                present: TEST_MATRIX[DEV].valveActors.list[2].present,

                temperature: TEST_MATRIX[DEV].valveActors.list[2].temperature,
                offset: TEST_MATRIX[DEV].valveActors.list[2].offset,
            },
        ],
    };
    TEST_MATRIX[DEV].tempSensors.ains = []; //collect temp ains
    TEST_MATRIX[DEV].tempSensors.list.forEach((temp) => {
        TEST_MATRIX[DEV].tempSensors.ains.push(temp.ain);
    });
    
    //2 energyMeters (are currentyl switches, so refers to switches for test
    TEST_MATRIX[DEV].energyMeters = 
    {
        list: [
            {
                ain: TEST_MATRIX[DEV].switchActors.list[0].ain,
                id: TEST_MATRIX[DEV].switchActors.list[0].id,
                manufacturer: TEST_MATRIX[DEV].switchActors.list[0].manufacturer,
                productname: TEST_MATRIX[DEV].switchActors.list[0].productname,
                fwversion: TEST_MATRIX[DEV].switchActors.list[0].fwversion,
                name: TEST_MATRIX[DEV].switchActors.list[0].name,
                present: TEST_MATRIX[DEV].switchActors.list[0].present,

                power: TEST_MATRIX[DEV].switchActors.list[0].power,
                energy: TEST_MATRIX[DEV].switchActors.list[0].energy,
            },
            {
                ain: TEST_MATRIX[DEV].switchActors.list[1].ain,
                id: TEST_MATRIX[DEV].switchActors.list[1].id,
                manufacturer: TEST_MATRIX[DEV].switchActors.list[1].manufacturer,
                productname: TEST_MATRIX[DEV].switchActors.list[1].productname,
                fwversion: TEST_MATRIX[DEV].switchActors.list[1].fwversion,
                name: TEST_MATRIX[DEV].switchActors.list[1].name,
                present: TEST_MATRIX[DEV].switchActors.list[1].present,

                power: TEST_MATRIX[DEV].switchActors.list[1].power,
                energy: TEST_MATRIX[DEV].switchActors.list[1].energy,
            },
        ],
    };
    TEST_MATRIX[DEV].energyMeters.ains = []; //collect nrgy ains
    TEST_MATRIX[DEV].energyMeters.list.forEach((nrgy) => {
        TEST_MATRIX[DEV].energyMeters.ains.push(nrgy.ain);
    });
    
    //4 (dummy) alarms
    TEST_MATRIX[DEV].alarms = 
    {
        list: [
            {
                ain: "00000000001",
                id: "19",
                manufacturer: "???",
                productname: "dummy alert",
                fwversion: "03.33",
                present: "0",
                state: "0",
            },
            {
                ain: "00000000002",
                id: "20",
                manufacturer: "???",
                productname: "dummy alert",
                fwversion: "03.33",
                present: "0",
                state: "0",
            },
            {
                ain: "00000000003",
                id: "21",
                manufacturer: "???",
                productname: "dummy alert",
                fwversion: "03.33",
                present: "0",
                state: "0",
            },
            {
                ain: "00000000004",
                id: "22",
                manufacturer: "???",
                productname: "dummy alert",
                fwversion: "03.33",
                present: "0",
                state: "0",
            },
        ],
    };
    TEST_MATRIX[DEV].alarms.ains = []; //collect alarm ains
    TEST_MATRIX[DEV].alarms.list.forEach((alarm) => {
        TEST_MATRIX[DEV].alarms.ains.push(alarm.ain);
    });

};

init();

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

// retreive valid params as object
// mode is expected in as --mode=(dev|custom|live) //= can be replaced by any character, also space etc.
function retrieveGlobalsCmdLineArgs() {
    var args = {
        mode: DEV, //default
    };
    process.argv.forEach((param) => { 
        if (param.startsWith('--mode')) { 
            var requestedMode = param.replace(/--mode./,'').toLowerCase(); 
            if (requestedMode === DEV || requestedMode === CUSTOM || requestedMode === LIVE) 
                args.mode = requestedMode;
        } else if (param.startsWith('--user')) { 
            args.user = param.replace(/--user./,'') ; 
        } else if (param.startsWith('--pwd')) { 
            args.pwd = param.replace(/--pwd./,'') ; 
        } else if (param.startsWith('--url')) { 
            args.url = param.replace(/--url./,'') ; 
        } else if (param === '--strict') { 
            args.strict = true; 
        }     
    });
    return args;
//    console.log('No valid testmode found via param --mode=(dev|custom|live) -> Using default mode', DEV);
//    return DEV; //no match -> default
}
 
// prepare globals
function init() {
    var args = retrieveGlobalsCmdLineArgs();
    MODE = args.mode;
    
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
    
    module.exports.cfgTestMatrix(); //set test data
    TEST_MATRIX[LIVE].user = args.user; //set live user form cmd line
    TEST_MATRIX[LIVE].pwd = args.pwd; //and live password
    TEST_MATRIX[LIVE].options.strictSSL = args.strict;
    if (args.url) TEST_MATRIX[LIVE].options.url = args.url;
}
 
//sync loader for test xml file(s) to stub diffrent scenarios
function loadStubDevicelistInfoXML(file)
{
    const FS = require('fs'); //required for read mock xml
    return FS.readFileSync(file, {encoding: 'utf-8'});
}