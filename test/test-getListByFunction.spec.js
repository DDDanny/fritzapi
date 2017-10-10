"use strict";
/* jshint esversion: 6 */
/* jshint -W030 */ //allow Expected an assignment or function call and instead saw an expression
/* jslint node: true */
/*global describe, it, before, beforeEach, after, afterEach */

/*
 *  Testing of getListByFunctions and dedicated calls
 */

const cfg = require('./config');

const sinon = require('sinon');

const chai = require('chai');

const sinonChai = require('sinon-chai'), should = chai.should();
chai.use(sinonChai);
chai.use(require('chai-as-promised'));

const bluebird = require('bluebird');

var fritzapi = require('../index');
var fritz;


describe('.getListByFunction [' + cfg.getTestmode() + ']', function () {
    var getListByFunctionSpy;
    beforeEach(() => {
        getListByFunctionSpy = sinon.sandbox.spy(fritzapi, "getListByFunction");
    });

    describe('functional-api', function () {
        it('no bit => empty list', () => {
            fritzapi.getListByFunction("dummy", undefined, undefined).should.eventually.be.an('array').that.should.eventually.be.empty;
            fritzapi.getListByFunction("dummy", null, undefined).should.eventually.be.an('array').that.should.eventually.be.empty;
        });
        it('0 bit => empty list', () => {
            fritzapi.getListByFunction("dummy", 0, undefined).should.eventually.be.an('array').that.should.eventually.be.empty;
        });
        
        if (!cfg.isLiveTest()) { //non - live
            it('will use a given devicelist (stubbbed, caching)',  function (done) {
                fritzapi.getDeviceList("aldummy").then((dl) => {
                    var options = {}; options.devicelist = dl;
                    Promise.all([
                        fritzapi.getListByFunction("aldummy", options, fritzapi.FUNCTION_ALARM),
                        fritzapi.getListByFunction("vadummy", options, fritzapi.FUNCTION_THERMOSTAT),
                        fritzapi.getListByFunction("emdummy", options, fritzapi.FUNCTION_ENERGYMETER),
                        fritzapi.getListByFunction("tsdummy", options, fritzapi.FUNCTION_TEMPERATURESENSOR),
                        fritzapi.getListByFunction("swdummy", options, fritzapi.FUNCTION_OUTLET),
                        fritzapi.getListByFunction("drdummy", options, fritzapi.FUNCTION_DECTREPEATER),
                    ]).then(() => {
                        cfg.getDevicelistInfoSinon().should.have.been.calledOnce;
                    }).then(done, done);
                });
            });
            
            it('getValveList (stubbed XML)', (done) => {
                fritzapi.getValveList("vadummy")
                    .should.eventually.be.an('array').that
                    .should.eventually.have.length(cfg.readValue(['valveActors', 'ains']).length).that
                    .should.eventually.deep.equal(cfg.readValue(['valveActors', 'ains']))
                    .then(() => {
                        cfg.getDevicelistInfoSinon().should.have.been.calledOnce;
                        getListByFunctionSpy.should.have.been.calledWith("vadummy", undefined, fritzapi.FUNCTION_THERMOSTAT);
                    }).then(done, done);
            });
            
            it('getSwitchList (stubbed XML)', (done) => {
                fritzapi.getSwitchList("swdummy")
                    .should.eventually.be.an('array').that
                    .should.eventually.have.length(cfg.readValue(['switchActors', 'ains']).length).that
                    .should.eventually.deep.equal(cfg.readValue(['switchActors', 'ains']))
                    .then(() => {
                        cfg.getDevicelistInfoSinon().should.have.been.calledOnce;
                        getListByFunctionSpy.should.have.been.calledWith("swdummy", undefined, fritzapi.FUNCTION_OUTLET);
                    }).then(done, done);
            });
            
            it('getTemperatureSensorList (stubbed XML)', (done) => {
                fritzapi.getTemperatureSensorList("tsdummy")
                    .should.eventually.be.an('array').that
                    .should.eventually.have.length(cfg.readValue(['tempSensors', 'ains']).length).that
                    .should.eventually.deep.equal(cfg.readValue(['tempSensors', 'ains']))
                    .then(() => {
                        cfg.getDevicelistInfoSinon().should.have.been.calledOnce;
                        getListByFunctionSpy.should.have.been.calledWith("tsdummy", undefined, fritzapi.FUNCTION_TEMPERATURESENSOR);
                    }).then(done, done);
            });
            
            it('getEnergyMeterList (stubbed XML)', (done) => {
                fritzapi.getEnergyMeterList("emdummy")
                    .should.eventually.be.an('array').that
                    .should.eventually.have.length(cfg.readValue(['energyMeters', 'ains']).length).that
                    .should.eventually.deep.equal(cfg.readValue(['energyMeters', 'ains']))
                    .then(() => {
                        cfg.getDevicelistInfoSinon().should.have.been.calledOnce;
                        getListByFunctionSpy.should.have.been.calledWith("emdummy", undefined, fritzapi.FUNCTION_ENERGYMETER);
                    }).then(done, done);
            });
            
            it('getDectRepeaterList (stubbed XML)', (done) => {
                fritzapi.getDectRepeaterList("drdummy")
                    .should.eventually.be.an('array').that
                    .should.eventually.have.length(cfg.readValue(['dectRepeaters', 'ains']).length).that
                    .should.eventually.deep.equal(cfg.readValue(['dectRepeaters', 'ains']))
                    .then(() => {
                        cfg.getDevicelistInfoSinon().should.have.been.calledOnce;
                        getListByFunctionSpy.should.have.been.calledWith("drdummy", undefined, fritzapi.FUNCTION_DECTREPEATER);
                    }).then(done, done);
            });

            it('getAlarmList (stubbed XML)', (done) => {
                fritzapi.getAlarmList("aldummy")
                    .should.eventually.be.an('array').that
                    .should.eventually.have.length(cfg.readValue(['alarms', 'ains']).length).that
                    .should.eventually.deep.equal(cfg.readValue(['alarms', 'ains']))
                    .then(() => {
                        cfg.getDevicelistInfoSinon().should.have.been.calledOnce;
                        getListByFunctionSpy.should.have.been.calledWith("aldummy", undefined, fritzapi.FUNCTION_ALARM);
                    }).then(done, done);
            });

        } else {

            it('from fritz.box', (done) => {
                var options = cfg.readValue(['options']);
                fritzapi.getSessionID(cfg.readValue(['user']), cfg.readValue(['pwd']), options).then((sid) => {
                    fritzapi.getAlarmList(sid)
                        .should.eventually.be.an('array').that
                        .should.eventually.have.length(cfg.readValue(['alarms', 'ains']).length).that
                        .should.eventually.deep.equal(cfg.readValue(['alarms', 'ains']))
                        .then(() => {
                            getListByFunctionSpy.should.have.been.calledWith(sid, undefined, fritzapi.FUNCTION_ALARM);
                        }).then(done, done);
                });
            });
        }
    });

    describe('oo-api', function () {
        beforeEach(() => {
            if (!cfg.isLiveTest()) {
                fritz = new fritzapi.Fritz("user","pwd","url");
                fritz.sid = "avoidlogin";
            } else {
              fritz = new fritzapi.Fritz(cfg.readValue(['user']), cfg.readValue(['pwd']), cfg.readValue(['options']).url, cfg.readValue(['options']).strictSSL);  
            }
        });
        afterEach(() => {
            fritz = null;
        });
        it('no bit => empty list', () => {
            fritz.getListByFunction("dummy", undefined, undefined).should.eventually.be.an('array').that.should.eventually.be.empty;
            fritz.getListByFunction("dummy", null, undefined).should.eventually.be.an('array').that.should.eventually.be.empty;
        });
        it('0 bit => empty list', () => {
            fritz.getListByFunction("dummy", 0, undefined).should.eventually.be.an('array').that.should.eventually.be.empty;
        });
        //VALVE (Heater)
        it('getValveList', (done) => {
            fritz.getValveList()
                .should.eventually.be.an('array').that
                .should.eventually.have.length(cfg.readValue(['valveActors', 'ains']).length).that
                .should.eventually.deep.equal(cfg.readValue(['valveActors', 'ains'])).then(() => {
                
                getListByFunctionSpy.should.have.been.calledWith(fritz.sid, fritz.options, fritz.THERMOSTAT);
            }).then(done, done);
        });
        //SWITCH
        it('getSwitchList (cached)', (done) => {
            fritz.getDeviceList().then((dl) => {
                var options = fritz.options; //needed for callwith check...
                options.devicelist = dl;
                fritz.getSwitchList(options).then((switches) => {
                    switches.should.be.an('array');
                    switches.should.have.length(cfg.readValue(['switchActors', 'ains']).length);
                    switches.should.deep.equal(cfg.readValue(['switchActors', 'ains']));
                    
                    getListByFunctionSpy.should.have.been.calledWith(fritz.sid, options, fritz.OUTLET);
                }).then(done, done);
            });
        });
        it('getOutletList (same as getSwitchList with no cache (= no options.devicelist)', (done) => {
            //would get switches directly via executeCommand(...,'getswitchlist'), so method needs to to be stubbed in non live scenario to retrieve filtered XML call which getSwitchList does......
            var getOutletListSinon;
            if (!cfg.isLiveTest()) {
                getOutletListSinon = sinon.sandbox.stub(fritzapi, "getOutletList").usingPromise(bluebird.Promise).resolves(
                    fritzapi.getSwitchList() //this looks strange, but no other way in on-live scen
                );
            } else {
                getOutletListSinon = sinon.sandbox.spy(fritzapi, "getOutletList");
            }
            
            fritz.getOutletList()
                .should.eventually.be.an('array').that
                .should.eventually.have.length(cfg.readValue(['switchActors', 'ains']).length).that
                .should.eventually.deep.equal(cfg.readValue(['switchActors', 'ains'])).then(() => {

                    getOutletListSinon.should.have.been.calledWith(fritz.sid, fritz.options);
                }).then(done, done);
        });
        //TEMPERATURE SENSOR
        it('getTemperatureSensorList', (done) => {
            fritz.getTemperatureSensorList()
                .should.eventually.be.an('array').that
                .should.eventually.have.length(cfg.readValue(['tempSensors', 'ains']).length).that
                .should.eventually.deep.equal(cfg.readValue(['tempSensors', 'ains'])).then(() => {
                
                getListByFunctionSpy.should.have.been.calledWith(fritz.sid, fritz.options, fritz.TEMPERATURESENSOR);
            }).then(done, done);
        });
        //ENERGY METER
        it('getEnergyMeterList', (done) => {
            fritz.getEnergyMeterList()
                .should.eventually.be.an('array').that
                .should.eventually.have.length(cfg.readValue(['energyMeters', 'ains']).length).that
                .should.eventually.deep.equal(cfg.readValue(['energyMeters', 'ains'])).then(() => {
                
                getListByFunctionSpy.should.have.been.calledWith(fritz.sid, fritz.options, fritz.ENERGYMETER);
            }).then(done, done);
        });
        //DECT REPEATER
        it('getDectRepeaterList', (done) => {
            fritz.getDectRepeaterList()
                .should.eventually.be.an('array').that
                .should.eventually.have.length(cfg.readValue(['dectRepeaters', 'ains']).length).that
                .should.eventually.deep.equal(cfg.readValue(['dectRepeaters', 'ains'])).then(() => {
                
                getListByFunctionSpy.should.have.been.calledWith(fritz.sid, fritz.options, fritz.DECTREPEATER);
            }).then(done, done);
        });
        //ALARM
        it('getAlarmList', (done) => {
            fritz.getAlarmList()
                .should.eventually.be.an('array').that
                .should.eventually.have.length(cfg.readValue(['alarms', 'ains']).length).that
                .should.eventually.deep.equal(cfg.readValue(['alarms', 'ains'])).then(() => {
                
                getListByFunctionSpy.should.have.been.calledWith(fritz.sid, fritz.options, fritz.ALARM);
            }).then(done, done);
        });
    });
});