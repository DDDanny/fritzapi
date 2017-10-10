"use strict";
/* jshint esversion: 6 */
/* jshint -W030 */ //allow Expected an assignment or function call and instead saw an expression
/* jslint node: true */
/*global describe, it, before, beforeEach, after, afterEach */

/*
 *  Testing of device switch related calls
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

var expectedDevices = cfg.readValue(['switchActors', 'ains']);
var expectedValues = cfg.readValue(['switchActors', 'list']);

describe('Device: Switch [' + cfg.getTestmode() + ']', function () {

//oo and functional will be executed in each testcase together
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

    describe('.getId', function () {
        it('via .getDevice for ' + cfg.readValue(['switchActors', 'ains']).length + ' devices', (done) => {
            var getDeviceSpy = sinon.sandbox.spy(fritzapi, "getDevice");
            var switches = [];

            expectedDevices.forEach( (ain) => {
                switches.push(fritz.getId(ain));
            });

            Promise.all(switches).then((values) => {
                values.forEach((id, i) => {
                        id.should.be.equal(expectedValues[i].id);
                });
            }).then(() => {
                getDeviceSpy.should.have.callCount(cfg.readValue(['switchActors', 'ains']).length);
                cfg.getDevicelistInfoSinon().should.have.callCount(cfg.readValue(['switchActors', 'ains']).length);
            }).then(done, done);
        });
        it('via given devicelist for ' + cfg.readValue(['switchActors', 'ains']).length + ' devices', (done) => {
            var getDeviceSpy = sinon.sandbox.spy(fritzapi, "getDevice");
            var switches = [];

            fritz.getDeviceList().then((dl) => {
                var options = fritz.options; 
                options.devicelist = dl;

                expectedDevices.forEach( (ain) => {
                    switches.push(fritz.getId(ain, options));
                });

                Promise.all(switches).then((values) => {
                    values.forEach((id, i) => {
                        id.should.be.equal(expectedValues[i].id);
                    });
                }).then(() => {
                    getDeviceSpy.should.have.callCount(cfg.readValue(['switchActors', 'ains']).length);
                    cfg.getDevicelistInfoSinon().should.have.been.calledOnce;
                }).then(done, done);;
            })
        });
    });
        
    describe('.getName', function () {
        it('via .getDevice for ' + cfg.readValue(['switchActors', 'ains']).length + ' devices', (done) => {
            var getDeviceSpy = sinon.sandbox.spy(fritzapi, "getDevice");
            var switches = [];

            expectedDevices.forEach( (ain) => {
                switches.push(fritz.getName(ain));
            });

            Promise.all(switches).then((values) => {
                values.forEach((name, i) => {
                        name.should.be.equal(expectedValues[i].name);
                });
            }).then(() => {
                getDeviceSpy.should.have.callCount(cfg.readValue(['switchActors', 'ains']).length);
                cfg.getDevicelistInfoSinon().should.have.callCount(cfg.readValue(['switchActors', 'ains']).length);
            }).then(done, done);
        });
        it('via given devicelist for ' + cfg.readValue(['switchActors', 'ains']).length + ' devices', (done) => {
            var getDeviceSpy = sinon.sandbox.spy(fritzapi, "getDevice");
            var switches = [];

            fritz.getDeviceList().then((dl) => {
                var options = fritz.options; 
                options.devicelist = dl;

                expectedDevices.forEach( (ain) => {
                    switches.push(fritz.getName(ain, options));
                });

                Promise.all(switches).then((values) => {
                    values.forEach((name, i) => {
                        name.should.be.equal(expectedValues[i].name);
                    });
                }).then(() => {
                    getDeviceSpy.should.have.callCount(cfg.readValue(['switchActors', 'ains']).length);
                    cfg.getDevicelistInfoSinon().should.have.been.calledOnce;
                }).then(done, done);;
            })
        });
    });
    
    describe('.getDevice', function () {
        it('compare completely ' + cfg.readValue(['switchActors', 'ains']).length + ' devices', (done) => {
            //compares all avail attributes in config against the retrieved attributes
            var getDeviceSpy = sinon.sandbox.spy(fritzapi, "getDevice");
            var switches = [];
            expectedDevices.forEach( (ain) => {
                switches.push(fritz.getDevice(ain));
            });

            Promise.all(switches).then((values) => {
                values.forEach((device, i) => {
                    device.identifier.replace(/\s/g, '').should.be.equal(expectedValues[i].ain);

                    device.id.should.be.equal(expectedValues[i].id);
                    device.manufacturer.should.be.equal(expectedValues[i].manufacturer);
                    device.productname.should.be.equal(expectedValues[i].productname);
                    device.fwversion.should.be.equal(expectedValues[i].fwversion);
                    device.name.should.be.equal(expectedValues[i].name);
                    device.present.should.be.equal(expectedValues[i].present);

                    device.switch.state.should.be.equal(expectedValues[i].state);
                    device.switch.mode.should.be.equal(expectedValues[i].mode);
                    device.switch.lock.should.be.equal(expectedValues[i].lock);
                    device.switch.devicelock.should.be.equal(expectedValues[i].devicelock);

                    device.temperature.celsius.should.be.equal(expectedValues[i].temperature);
                    device.temperature.offset.should.be.equal(expectedValues[i].offset);

                    device.powermeter.power.should.be.equal(expectedValues[i].power);
                    device.powermeter.energy.should.be.equal(expectedValues[i].energy);
                });
            }).then(() => {
                getDeviceSpy.should.have.callCount(cfg.readValue(['switchActors', 'ains']).length);
                cfg.getDevicelistInfoSinon().should.have.callCount(cfg.readValue(['switchActors', 'ains']).length);
            }).then(done, done);
        });
        
        it('compare completely ' + cfg.readValue(['switchActors', 'ains']).length + ' devices [cached]', (done) => {
            //compares all avail attributes in config against the retrieved attributes
            var getDeviceSpy = sinon.sandbox.spy(fritzapi, "getDevice");
            var switches = [];

            fritz.getDeviceList().then((dl) => {
                var options = fritz.options; 
                options.devicelist = dl;

                expectedDevices.forEach( (ain) => {
                    switches.push(fritz.getDevice(ain, options));
                });

                Promise.all(switches).then((values) => {
                    values.forEach((device, i) => {
                        device.identifier.replace(/\s/g, '').should.be.equal(expectedValues[i].ain);

                        device.id.should.be.equal(expectedValues[i].id);
                        device.manufacturer.should.be.equal(expectedValues[i].manufacturer);
                        device.productname.should.be.equal(expectedValues[i].productname);
                        device.fwversion.should.be.equal(expectedValues[i].fwversion);
                        device.name.should.be.equal(expectedValues[i].name);
                        device.present.should.be.equal(expectedValues[i].present);

                        device.switch.state.should.be.equal(expectedValues[i].state);
                        device.switch.mode.should.be.equal(expectedValues[i].mode);
                        device.switch.lock.should.be.equal(expectedValues[i].lock);
                        device.switch.devicelock.should.be.equal(expectedValues[i].devicelock);

                        device.temperature.celsius.should.be.equal(expectedValues[i].temperature);
                        device.temperature.offset.should.be.equal(expectedValues[i].offset);

                        device.powermeter.power.should.be.equal(expectedValues[i].power);
                        device.powermeter.energy.should.be.equal(expectedValues[i].energy);
                    });
                }).then(() => {
                    getDeviceSpy.should.have.callCount(cfg.readValue(['switchActors', 'ains']).length);
                    cfg.getDevicelistInfoSinon().should.have.been.calledOnce;
                }).then(done, done);;
            })
        });
    });

    describe('.getPresence', function () {
        it('via .getDevice for ' + cfg.readValue(['switchActors', 'ains']).length + ' devices', (done) => {
            var getDeviceSpy = sinon.sandbox.spy(fritzapi, "getDevice");
            var switches = [];

            expectedDevices.forEach( (ain) => {
                switches.push(fritz.getPresence(ain));
            });

            Promise.all(switches).then((values) => {
                values.forEach((present, i) => {
                        present.should.be.equal(expectedValues[i].present === '1');
                });
            }).then(() => {
                getDeviceSpy.should.have.callCount(cfg.readValue(['switchActors', 'ains']).length);
                cfg.getDevicelistInfoSinon().should.have.callCount(cfg.readValue(['switchActors', 'ains']).length);
            }).then(done, done);
        });
        it('via given devicelist for ' + cfg.readValue(['switchActors', 'ains']).length + ' devices', (done) => {
            var getDeviceSpy = sinon.sandbox.spy(fritzapi, "getDevice");
            var switches = [];

            fritz.getDeviceList().then((dl) => {
                var options = fritz.options; 
                options.devicelist = dl;

                expectedDevices.forEach( (ain) => {
                    switches.push(fritz.getPresence(ain, options));
                });

                Promise.all(switches).then((values) => {
                    values.forEach((present, i) => {
                        present.should.be.equal(expectedValues[i].present === '1');
                    });
                }).then(() => {
                    getDeviceSpy.should.have.callCount(cfg.readValue(['switchActors', 'ains']).length);
                    cfg.getDevicelistInfoSinon().should.have.been.calledOnce;
                }).then(done, done);;
            })
        });
    });
    
});