"use strict";
/* jshint esversion: 6, -W079 */
/* jslint node: true */

/**
 * smartFritz - Fritz goes smartHome
 *
 * AVM SmartHome nodeJS Control - for AVM Fritz!Box and Dect200 Devices
 *
 * @author Andreas Goetz <cpuidle@gmx.de>
 *
 * Forked from: https://github.com/nischelwitzer/smartfritz
 * nischi - first version: July 2014
 *
 * based on: Node2Fritz by steffen.timm on 05.12.13 for Fritz!OS > 05.50
 * and  thk4711 (code https://github.com/pimatic/pimatic/issues/38)
 * Documentation is at http://www.avm.de/de/Extern/files/session_id/AHA-HTTP-Interface.pdf
 */

var Promise = require('bluebird');
var request = require('request');
var cheerio = require('cheerio');
var parser = require('xml2json-light');
var extend = require('extend');


/*
 * Object-oriented API
 */

module.exports.Fritz = Fritz;

function Fritz(username, password, uri, strictSSL) {
    this.sid = null;
    this.username = username;
    this.password = password;
    this.options = { 
        url: uri || 'https://fritz.box', //default https
        strictSSL: strictSSL || !(strictSSL == undefined && !uri) //on default url, allow self signed certificates
    };

    //bitfunctions hidden, unchangable to prototype
    if (!Fritz.prototype.ALARM)             { Object.defineProperty( Fritz.prototype, "ALARM",             {value: FUNCTION_ALARM,             writable: false, enumerable: true }); }
    if (!Fritz.prototype.THERMOSTAT)        { Object.defineProperty( Fritz.prototype, "THERMOSTAT",        {value: FUNCTION_THERMOSTAT,        writable: false, enumerable: true }); }
    if (!Fritz.prototype.ENERGYMETER)       { Object.defineProperty( Fritz.prototype, "ENERGYMETER",       {value: FUNCTION_ENERGYMETER,       writable: false, enumerable: true }); }
    if (!Fritz.prototype.TEMPERATURESENSOR) { Object.defineProperty( Fritz.prototype, "TEMPERATURESENSOR", {value: FUNCTION_TEMPERATURESENSOR, writable: false, enumerable: true }); }
    if (!Fritz.prototype.OUTLET)            { Object.defineProperty( Fritz.prototype, "OUTLET",            {value: FUNCTION_OUTLET,            writable: false, enumerable: true }); }
    if (!Fritz.prototype.DECTREPEATER)      { Object.defineProperty( Fritz.prototype, "DECTREPEATER",      {value: FUNCTION_DECTREPEATER,      writable: false, enumerable: true }); }

    if (!Fritz.prototype.INVALID_SID)       { Object.defineProperty( Fritz.prototype, "INVALID_SID",       {value: INVALID_SID,                writable: false, enumerable: true }); }    
}

Fritz.prototype = {
    call: function(func) {
        var originalSID = this.sid;

        /* jshint laxbreak:true */
        var promise = this.sid
            ? Promise.resolve(this.sid)
            : module.exports.getSessionID(this.username, this.password, this.options);

        // function arguments beyond func parameter
        var args = Array.from(arguments).slice(1).concat(this.options);
        return promise.then(function(sid) {
            this.sid = sid;

            return func.apply(null, [this.sid].concat(args)).catch(function(error) {
                if (error.response && error.response.statusCode == 403) {
                    // this.sid has not been updated or is invalid - get a new SID
                    if (this.sid === null || this.sid === originalSID) {
                        this.sid = null;

                        return module.exports.getSessionID(this.username, this.password, this.options).then(function(sid) {
                            // this session id is the most current one - so use it from now on
                            this.sid = sid;

                            return func.apply(null, [this.sid].concat(args));
                        }.bind(this));
                    }
                    // this.sid has already been updated during the func() call - assume this is a valid SID now
                    else {
                        return func.apply(null, [this.sid].concat(args));
                    }
                }

                throw error;
            }.bind(this));
        }.bind(this));
    },

    getSID: function() {
        return this.sid;
    },

    getDeviceListInfo: function() {
        return this.call(module.exports.getDeviceListInfo);
    },

    getDeviceList: function() {
        return this.call(module.exports.getDeviceList);
    },

    getDeviceListVersion: function() {
        return this.call(module.exports.getDeviceListVersion);
    },

    getDevice: function(ain) {
        return this.call(module.exports.getDevice, ain);
    },

    getName: function(ain) {
        return this.call(module.exports.getDeviceName, ain);
    },

    getId: function(ain) {
        return this.call(module.exports.getDeviceId, ain);
    },

    getPresence: function(ain) {
        return this.call(module.exports.getPresence, ain);
    },

    getListByFunction: function() {
        return this.call(module.exports.getListByFunction);
    },
    
    getTemperature: function(ain) {
        return this.call(module.exports.getTemperature, ain);
    },

    getSwitchList: function() {
        return this.call(module.exports.getSwitchList);
    },

    getOutletList: function() {
        return this.call(module.exports.getSwitchList);
    },

    getThermostatList: function() {
        return this.call(module.exports.getThermostatList);
    },

    getValveList: function() {
        return this.call(module.exports.getValveList);
    },

    getDectRepeaterList: function() {
        return this.call(module.exports.getDectRepeaterList);
    },

    getAlarmList: function() {
        return this.call(module.exports.getAlarmList);
    },

    getEnergyMeterList: function() {
        return this.call(module.exports.getEnergyMeterList);
    },

    getTemperatureSensorList: function() {
        return this.call(module.exports.getTemperatureSensorList);
    },
    
    getSwitchState: function(ain) {
        return this.call(module.exports.getSwitchState, ain);
    },

    setSwitchOn: function(ain) {
        return this.call(module.exports.setSwitchOn, ain);
    },

    setSwitchOff: function(ain) {
        return this.call(module.exports.setSwitchOff, ain);
    },

    getSwitchEnergy: function(ain) {
        return this.call(module.exports.getSwitchEnergy, ain);
    },

    getSwitchPower: function(ain) {
        return this.call(module.exports.getSwitchPower, ain);
    },

    getSwitchPresence: function(ain) {
        return this.call(module.exports.getSwitchPresence, ain);
    },

    getSwitchName: function(ain) {
        return this.call(module.exports.getSwitchName, ain);
    },

    setTempTarget: function(ain, temp) {
        return this.call(module.exports.setTempTarget, ain, temp);
    },

    getTempTarget: function(ain) {
        return this.call(module.exports.getTempTarget, ain);
    },

    getTempNight: function(ain) {
        return this.call(module.exports.getTempNight, ain);
    },

    getTempComfort: function(ain) {
        return this.call(module.exports.getTempComfort, ain);
    },

    getBatteryCharge: function(ain) {
        return this.call(module.exports.getBatteryCharge, ain);
    },

    getGuestWlan: function() {
        return this.call(module.exports.getGuestWlan);
    },

    setGuestWlan: function(enable) {
        return this.call(module.exports.setGuestWlan, enable);
    },

    getOSVersion: function() {
        return this.call(module.exports.getOSVersion);
    },
};


/*
 * Functional API
 */

const INVALID_SID = '0000000000000000';
 
var bufferedDevicelistInfoVersion;
var defaults = { url: 'http://fritz.box' };

/**
 * Check if numeric value
 */
function isNumeric(n) {
    return !isNaN(parseFloat(n, 10)) && isFinite(n);
}

/**
 * Execute HTTP request that honors failed/invalid login
 */
function httpRequest(path, req, options)
{
    return new Promise(function(resolve, reject) {
        req = extend({}, defaults, req, options);
        req.url += path;

        request(req, function(error, response, body) {
            if (error || !(/^2/.test('' + response.statusCode)) || /action=".?login.lua"/.test(body)) {
                if (/action=".?login.lua"/.test(body)) {
                    // fake failed login if redirected to login page without HTTP 403
                    response.statusCode = 403;
                }
                reject({
                    error: error,
                    response: response,
                    options: req
                });
            }
            else {
                resolve(body.trim());
            }
        });
    });
}

/**
 * Execute Fritz API command for device specified by AIN
 */
function executeCommand(sid, command, ain, options, path)
{
    path = path || '/webservices/homeautoswitch.lua?0=0';

    if (sid)
        path += '&sid=' + sid;
    if (command)
        path += '&switchcmd=' + command;
    if (ain)
        path += '&ain=' + ain;

    return httpRequest(path, {}, options);
}

/*
 * Temperature conversion
 */
const MIN_TEMP = 8;
const MAX_TEMP = 28;
const ON_TEMP = 254;
const OFF_TEMP = 253;

module.exports.MIN_TEMP = MIN_TEMP;
module.exports.MAX_TEMP = MAX_TEMP;
module.exports.ON_TEMP = ON_TEMP;
module.exports.OFF_TEMP = OFF_TEMP;

function temp2api(temp)
{
    var res;

    if (temp == 'on' || temp == 'ON' || temp === true || temp === AVM_TRUE)
        res = ON_TEMP;
    else if (temp == 'off' || temp == 'OFF' || temp === false || temp === AVM_FALSE)
        res = OFF_TEMP;
    else
        res = Math.round((Math.min(Math.max(temp, MIN_TEMP), MAX_TEMP) - MIN_TEMP) * 2) + (2 * MIN_TEMP); // 0.5C accuracy

    return res;
}

function api2temp(param)
{
    if (param == OFF_TEMP || param < MIN_TEMP)
        return 'off';
    if (param != OFF_TEMP && param > MAX_TEMP ) //all values above 28 that are not off temp
        return 'on';
    else
        return (parseFloat(param) - (2 * MIN_TEMP)) / 2 + MIN_TEMP; // 0.5C accuracy
}

//AVM true/false strings
const AVM_TRUE = '1';
const AVM_FALSE = '0';

// functions bitmask
const FUNCTION_ALARM               = 1 << 4;  // Alarm Sensor
const FUNCTION_THERMOSTAT          = 1 << 6;  // Comet DECT, Heizkostenregler
const FUNCTION_ENERGYMETER         = 1 << 7;  // Energie Messgerät
const FUNCTION_TEMPERATURESENSOR   = 1 << 8;  // Temperatursensor
const FUNCTION_OUTLET              = 1 << 9;  // Schaltsteckdose
const FUNCTION_DECTREPEATER        = 1 << 10; // AVM DECT Repeater

// #############################################################################

// run command for selected device
module.exports.executeCommand = executeCommand;

// supported temperature range
module.exports.MIN_TEMP = MIN_TEMP;
module.exports.MAX_TEMP = MAX_TEMP;

//AVM true/false strings
module.exports.AVM_TRUE  = AVM_TRUE;
module.exports.AVM_FALSE = AVM_FALSE;

// functions bitmask
module.exports.FUNCTION_ALARM               = FUNCTION_ALARM;
module.exports.FUNCTION_THERMOSTAT          = FUNCTION_THERMOSTAT;
module.exports.FUNCTION_ENERGYMETER         = FUNCTION_ENERGYMETER;
module.exports.FUNCTION_TEMPERATURESENSOR   = FUNCTION_TEMPERATURESENSOR;
module.exports.FUNCTION_OUTLET              = FUNCTION_OUTLET;
module.exports.FUNCTION_DECTREPEATER        = FUNCTION_DECTREPEATER;

//invalid session
module.exports.INVALID_SID = INVALID_SID;

/*
 * Session handling
 */

// get session id
module.exports.getSessionID = function(username, password, options)
{
    if (typeof username !== 'string') throw new Error('Invalid username');
    if (typeof password !== 'string') throw new Error('Invalid password');

    return executeCommand(null, null, null, options, '/login_sid.lua').then(function(body) {
        var challenge = body.match("<Challenge>(.*?)</Challenge>")[1];
        var challengeResponse = challenge +'-'+
            require('crypto').createHash('md5').update(Buffer(challenge+'-'+password, 'UTF-16LE')).digest('hex');
        var url = "/login_sid.lua?username=" + username + "&response=" + challengeResponse;

        return executeCommand(null, null, null, options, url).then(function(body) {
            return verifySession(body);
        });
    });
};

// check if session id is OK
module.exports.checkSession = function(sid, options)
{
    return executeCommand(sid, null, null, options, '/login_sid.lua').then(function(body) {
        return verifySession(body);
    });
};

//internal check session via body
function verifySession(body)
{
    var sessionID = body.match("<SID>(.*?)</SID>")[1];
    if (sessionID === INVALID_SID) {
        return Promise.reject(sessionID);
    }
    return sessionID;
}

//internal helper returns given devicelist or get it from fritz.box
function forkDevicelist(sid, options)
{
    /* jshint laxbreak:true */
    return options && options.devicelist
        ? Promise.resolve(options.devicelist) // get from cached
        : module.exports.getDeviceList(sid, options); // retrieve via all devices*/    
}

/*
 * General functions
 */

// get detailed device information (XML)
module.exports.getDeviceListInfo = function(sid, options)
{
    return executeCommand(sid, 'getdevicelistinfos', null, options);
};

// get device list
module.exports.getDeviceList = function(sid, options)
{
    return module.exports.getDeviceListInfo(sid, options).then(function(devicelistinfo) {
        var devices = parser.xml2json(devicelistinfo);
        bufferedDevicelistInfoVersion = devices.devicelist.version || undefined;
        // extract devices as array
        devices = [].concat((devices.devicelist || {}).device || []);
        return devices;
    });
};

// get (buffered) device list version
module.exports.getDeviceListVersion = function(sid, options)
{
    /* jshint laxbreak:true */
    return bufferedDevicelistInfoVersion
        ? Promise.resolve(bufferedDevicelistInfoVersion)
        : module.exports.getDeviceListInfo(sid, options).then(function(devicelistinfo) {
            bufferedDevicelistInfoVersion = parser.xml2json(devicelistinfo).devicelist.version;
            return bufferedDevicelistInfoVersion;
        });
};

// get single device
module.exports.getDevice = function(sid, ain, options)
{
    /* jshint laxbreak:true */
    var devicelist = options && options.devicelist
        ? Promise.resolve(options.devicelist)
        : module.exports.getDeviceList(sid, options);

    return devicelist.then((devices) => {
        var device = devices.find(function(device) {
            return device.identifier.replace(/\s/g, '') == ain;
        });

        return device || Promise.reject();
    });
};

// get name of any device
module.exports.getDeviceName = function(sid, ain, options)
{
    return module.exports.getDevice(sid, ain, options).then((device) => {
        return device.name;
    });
};

// get id of any device
module.exports.getDeviceId = function(sid, ain, options)
{
    return module.exports.getDevice(sid, ain, options).then((device) => {
        return device.id;
    });
};

// get AINs by a functionmask from fritzbox or from given options.devicelist
// for bit choose from FUNCTION_
module.exports.getListByFunction = function(sid, options, bit)
{
    if (!bit) return Promise.resolve([]); //undefined or 0 bits
    
    /* jshint laxbreak:true */
    var bitSupported = module.exports.FUNCTION_ALARM //move to export?
        | module.exports.FUNCTION_THERMOSTAT
        | module.exports.FUNCTION_ENERGYMETER
        | module.exports.FUNCTION_TEMPERATURESENSOR
        | module.exports.FUNCTION_OUTLET
        | module.exports.FUNCTION_DECTREPEATER;

    if (!bitSupported & bit) return Promise.reject(new Error('Unknown Function Bit' + bit) + '!');

    if (bit == module.exports.FUNCTION_OUTLET && options && !options.devicelist) {
        // switch requested, but no devicelist -> get switches direct
        return module.exports.getOutletList(sid, options);
    }

    return forkDevicelist(sid, options).then(function(allDevices) {
        var devices = allDevices.filter(function(device) {
            return device.functionbitmask & bit; //device match?
        }).map(function(device) {
            return device.identifier.replace(/\s/g, ''); // fix ain, no gaps
        });

        return Promise.resolve(devices);
    });
};

// get AINs of all dect heater controls from fritzbox or from given options.devicelist
module.exports.getValveList = function(sid, options)
{
    return module.exports.getListByFunction(sid, options, module.exports.FUNCTION_THERMOSTAT);
};

// get AINs of all switch supported devices from fritzbox or from given options.devicelist
module.exports.getSwitchList = function(sid, options)
{
    return module.exports.getListByFunction(sid, options, module.exports.FUNCTION_OUTLET);
};

// get AINs of all temperature supported devices from fritzbox or from given options.devicelist */
module.exports.getTemperatureSensorList = function(sid, options)
{
    return module.exports.getListByFunction(sid, options, module.exports.FUNCTION_TEMPERATURESENSOR);
};

// get AINs of all all energy meters from fritzbox or from given options.devicelist */
module.exports.getEnergyMeterList = function(sid, options)
{
    return module.exports.getListByFunction(sid, options, module.exports.FUNCTION_ENERGYMETER);
};

// get AINs of all dect repeaters from fritzbox or from given options.devicelist
module.exports.getDectRepeaterList = function(sid, options)
{
    return module.exports.getListByFunction(sid, options, module.exports.FUNCTION_DECTREPEATER);
};

// get AINs of all all alarm supported devices from fritzbox or from given options.devicelist
module.exports.getAlarmList = function(sid, options)
{
    return module.exports.getListByFunction(sid, options, module.exports.FUNCTION_ALARM);
};

// get temperature- both switches and thermostats are supported, but not powerline modules
module.exports.getTemperature = function(sid, ain, options)
{
    return executeCommand(sid, 'gettemperature', ain, options).then(function(body) {
        return parseFloat(body) / 10; // °C
    });
};

// get presence from deviceListInfo
module.exports.getPresence = function(sid, ain, options)
{
    return module.exports.getDevice(sid, ain, options).then(function(device) {
        return device.present === AVM_TRUE;
    });
};


/*
 * Switches
 */

// get switch list direct from fritzbox
module.exports.getOutletList = function(sid, options)
{
    return executeCommand(sid, 'getswitchlist', null, options).then(function(res) {
        // force empty array on empty result
        return res === "" ? [] : res.split(',');
    });
};

// get switch state
module.exports.getSwitchState = function(sid, ain, options)
{
    return executeCommand(sid, 'getswitchstate', ain, options).then(function(body) {
        return /^1/.test(body); // true if on
    });
};

// turn an outlet on. returns the state the outlet was set to
module.exports.setSwitchOn = function(sid, ain, options)
{
    return executeCommand(sid, 'setswitchon', ain, options).then(function(body) {
        return /^1/.test(body); // true if on
    });
};

// turn an outlet off. returns the state the outlet was set to
module.exports.setSwitchOff = function(sid, ain, options)
{
    return executeCommand(sid, 'setswitchoff', ain, options).then(function(body) {
        return /^1/.test(body); // false if off
    });
};

// get the total enery consumption. returns the value in Wh
module.exports.getSwitchEnergy = function(sid, ain, options)
{
    return executeCommand(sid, 'getswitchenergy', ain, options).then(function(body) {
        return parseFloat(body); // Wh
    });
};

// get the current enery consumption of an outlet. returns the value in mW
module.exports.getSwitchPower = function(sid, ain, options)
{
    return executeCommand(sid, 'getswitchpower', ain, options).then(function(body) {
        var power = parseFloat(body);
        return isNumeric(power) ? power / 1000 : null; // W
    });
};

// get the outet presence status
module.exports.getSwitchPresence = function(sid, ain, options)
{
    return executeCommand(sid, 'getswitchpresent', ain, options).then(function(body) {
        return /^1/.test(body); // true if present
    });
};

// get switch name
module.exports.getSwitchName = function(sid, ain, options)
{
    return executeCommand(sid, 'getswitchname', ain, options).then(function(body) {
        return body.trim();
    });
};


/*
 * Thermostats
 */

// get the thermostats
module.exports.getThermostatList = function(sid, options)
{
    return module.exports.getValveList(sid, options); 
};

// set target temperature (Solltemperatur)
module.exports.setTempTarget = function(sid, ain, temp, options)
{
    return executeCommand(sid, 'sethkrtsoll&param=' + temp2api(temp), ain, options).then(function(body) {
        // api does not return a value
        return temp;
    });
};

// get target temperature (Solltemperatur)
module.exports.getTempTarget = function(sid, ain, options)
{
    return executeCommand(sid, 'gethkrtsoll', ain, options).then(function(body) {
        return api2temp(body);
    });
};

// get night temperature (Absenktemperatur)
module.exports.getTempNight = function(sid, ain, options)
{
    return executeCommand(sid, 'gethkrabsenk', ain, options).then(function(body) {
        return api2temp(body);
    });
};

// get comfort temperature (Komforttemperatur)
module.exports.getTempComfort = function(sid, ain, options)
{
    return executeCommand(sid, 'gethkrkomfort', ain, options).then(function(body) {
        return api2temp(body);
    });
};

// get battery charge - not part of Fritz API // need admin rights :-(
module.exports.getBatteryCharge = function(sid, ain, options)
{
    return module.exports.getDevice(sid, ain, options).then(function(device) {
        var req = {
            method: 'POST',
            form: {
                sid: sid,
                xhr: 1,
                no_sidrenew: '',
                device: device.id,
                oldpage: '/net/home_auto_hkr_edit.lua',
                back_to_page: '/net/network.lua'
            }
        };

        return httpRequest('/data.lua', req, options).then(function(body) {
            var $ = cheerio.load(body);
            // search for Batter(ie|y)
            var battery = $('div>label:contains(Batter)+span').first().text().replace(/[\s%]/g, '');
            return isNumeric(battery) ? parseInt(battery, 10) : null;
        });
    });
};


/*
 * WLAN
 */

// get guest WLAN settings - not part of Fritz API
// ***deprecated*** advise to use https://www.npmjs.com/package/tr-O64 (https://github.com/soef/tr-064/)
module.exports.getGuestWlan = function(sid, options)
{
    return executeCommand(sid, null, null, options, '/wlan/guest_access.lua?0=0').then(function(body) {
        return parseHTML(body);
    });
};

// set guest WLAN settings - not part of Fritz API
// ***deprecated*** advise to use https://www.npmjs.com/package/tr-O64 (https://github.com/soef/tr-064/)
module.exports.setGuestWlan = function(sid, enable, options)
{
    /* jshint laxbreak:true */
    var settings = enable instanceof Object
        ? Promise.resolve(enable)
        : executeCommand(sid, null, null, options, '/wlan/guest_access.lua?0=0').then(function(body) {
            return extend(parseHTML(body), {
                activate_guest_access: enable
            });
        });

    return settings.then(function(settings) {
        // convert boolean to checkbox
        for (var property in settings) {
            if (settings[property] === true)
                settings[property] = 'on';
            else if (settings[property] === false)
                delete settings[property];
        }

        var req = {
            method: 'POST',
            form: extend(settings, {
                sid: sid,
                xhr: 1,
                no_sidrenew: '',
                apply: '',
                oldpage: '/wlan/guest_access.lua'
            })
        };

        return httpRequest('/data.lua', req, options).then(function(body) {
            return parseHTML(body);
        });
    });
};

/**
 * ***deprecated***
 * Parse guest WLAN form settings
 */
function parseHTML(html)
{
    var $ = cheerio.load(html);
    var form = $('form');
    var settings = {};

    $('input', form).each(function(i, elem) {
        var val;
        var name = $(elem).attr('name');
        if (!name) return;

        switch ($(elem).attr('type')) {
            case 'checkbox':
                val = $(elem).attr('checked') == 'checked';
                break;
            default:
                val = $(elem).val();
        }
        settings[name] = val;
    });

    $('select option[selected=selected]', form).each(function(i, elem) {
        var val = $(elem).val();
        var name = $(elem).parent().attr('name');
        settings[name] = val;
    });

    return settings;
}

// get OS version
// ***deprecated*** advise to use https://www.npmjs.com/package/tr-O64 (https://github.com/soef/tr-064/) via modul UserInterface (userifSCPD.pdf)
module.exports.getOSVersion = function(sid, options)
{
    var req = {
        method: 'POST',
        form: {
            sid: sid,
            xhr: 1,
            page: 'overview'
        }
    };

    /* jshint laxbreak:true */
    return httpRequest('/data.lua', req, options).then(function(body) {
        var json = JSON.parse(body);
        var osVersion = json.data && json.data.fritzos && json.data.fritzos.nspver
            ? json.data.fritzos.nspver
            : null;
        return osVersion;
    });
};

