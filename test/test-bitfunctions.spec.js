"use strict";
/* jshint esversion: 6 */
/* jslint node: true */
/*global describe, it, before, beforeEach, after, afterEach */

/*
    testing of bitfunctions

ALARM              === FUNCTION_ALARM               = 1 << 4;  // Alarm Sensor
THERMOSTAT         === FUNCTION_THERMOSTAT          = 1 << 6;  // Comet DECT, Heizkostenregler
ENERGYMETER        === FUNCTION_ENERGYMETER         = 1 << 7;  // Energie Messgerät
TEMPERATURESENSOR  === FUNCTION_TEMPERATURESENSOR   = 1 << 8;  // Temperatursensor
OUTLET             === FUNCTION_OUTLET              = 1 << 9;  // Schaltsteckdose
DECTREPEATER       === FUNCTION_DECTREPEATER        = 1 << 10; // AVM DECT Repeater    
*/

const cfg = require('./config');

const chai = require('chai'), expect = chai.expect, should = chai.should();
  
const fritzapi = require('../index'); //functional API

var fritz; //object API test object instance

describe('const/export bitfunctions [' + cfg.getTestmode() + ']', () => {
    describe('functional-api', () => {
        it('FUNCTION_ALARM', () => {
            fritzapi.FUNCTION_ALARM.should.be.a('Number');
            fritzapi.FUNCTION_ALARM.should.be.above(0);
        });
        it('FUNCTION_THERMOSTAT', () => {
            fritzapi.FUNCTION_THERMOSTAT.should.be.a('Number');
            fritzapi.FUNCTION_THERMOSTAT.should.be.above(0);
        });
        it('FUNCTION_ENERGYMETER', () => {
            fritzapi.FUNCTION_ENERGYMETER.should.be.a('Number');
            fritzapi.FUNCTION_ENERGYMETER.should.be.above(0);
        });
        it('FUNCTION_TEMPERATURESENSOR', () => {
            fritzapi.FUNCTION_TEMPERATURESENSOR.should.be.a('Number');
            fritzapi.FUNCTION_TEMPERATURESENSOR.should.be.above(0);
        });
        it('FUNCTION_OUTLET', () => {
            fritzapi.FUNCTION_OUTLET.should.be.a('Number');
            fritzapi.FUNCTION_OUTLET.should.be.above(0);
        });
        it('FUNCTION_DECTREPEATER', () => {
            fritzapi.FUNCTION_DECTREPEATER.should.be.a('Number');
            fritzapi.FUNCTION_DECTREPEATER.should.be.above(0);
        });
    });
    describe('oo-api', () => {
        beforeEach(() => {
            fritz = new fritzapi.Fritz("user","pwd","url");
        });
        afterEach(() => {
            fritz = null;
        });
        it('ALARM', () => {
            fritz.ALARM.should.be.equal(fritzapi.FUNCTION_ALARM);
            delete fritz.ALARM; //delete is silent (no throw etc.) //reports no error... so next test will fail...
            fritz.ALARM.should.be.equal(fritzapi.FUNCTION_ALARM);
            expect(() => {fritz.ALARM = 42;}).to.throw(TypeError); //should be readOnly
        });
        it('THERMOSTAT', () => {
            fritz.THERMOSTAT.should.be.equal(fritzapi.FUNCTION_THERMOSTAT);
            delete fritz.THERMOSTAT;
            fritz.THERMOSTAT.should.be.equal(fritzapi.FUNCTION_THERMOSTAT);
            expect(() => {fritz.THERMOSTAT = 42;}).to.throw(TypeError);
        });
        it('ENERGYMETER', () => {
            fritz.ENERGYMETER.should.be.equal(fritzapi.FUNCTION_ENERGYMETER);
            delete fritz.ENERGYMETER;
            fritz.ENERGYMETER.should.be.equal(fritzapi.FUNCTION_ENERGYMETER);
            expect(() => {fritz.ENERGYMETER = 42;}).to.throw(TypeError);
        });
        it('TEMPERATURESENSOR', () => {
            fritz.TEMPERATURESENSOR.should.be.equal(fritzapi.FUNCTION_TEMPERATURESENSOR);
            delete fritz.TEMPERATURESENSOR;
            fritz.TEMPERATURESENSOR.should.be.equal(fritzapi.FUNCTION_TEMPERATURESENSOR);
            expect(() => {fritz.TEMPERATURESENSOR = 42;}).to.throw(TypeError);
        });
        it('OUTLET', () => {
            fritz.OUTLET.should.be.equal(fritzapi.FUNCTION_OUTLET);
            delete fritz.OUTLET;
            fritz.OUTLET.should.be.equal(fritzapi.FUNCTION_OUTLET);
            expect(() => {fritz.OUTLET = 42;}).to.throw(TypeError);
        });
        it('DECTREPEATER', () => {
            fritz.DECTREPEATER.should.be.equal(fritzapi.FUNCTION_DECTREPEATER);
            delete fritz.DECTREPEATER;
            fritz.DECTREPEATER.should.be.equal(fritzapi.FUNCTION_DECTREPEATER);
            expect(() => {fritz.DECTREPEATER = 42;}).to.throw(TypeError);
        });
    });
});