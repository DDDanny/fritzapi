"use strict";
/* jshint esversion: 6 */

/*
 *  testing of devicelist
 */

const cfg = require('./config');

const sinon = require('sinon');

var chai = require('chai')
 ,should = chai.should();

const sinonChai = require('sinon-chai');
chai.use(sinonChai);

var fritzapi = require('../index');

describe('.getDeviceList [' + cfg.getTestmode() + ']', function () {
    describe('functional', function () {
        if (!cfg.isLiveTest()) { //non - live
            it('with stubbed', (done) => {
                fritzapi.getDeviceList().then( (devicelist) => {
                    devicelist.should.be.an('array');
                    cfg.getDevicelistInfoSinon().should.have.been.calledOnce;
                    fritzapi.getDeviceListVersion().then( (version) => {
                        cfg.readValue(['devicelist', 'version']).should.be.equal(version);
                    }).then(done, done);
                });
            });
        } else {
            it('from fritz.box', (done) => {
                fritzapi.getSessionID(cfg.readValue(['user']), cfg.readValue(['pwd']), cfg.readValue(['options'])).then((sid) => {
                    fritzapi.getDeviceList(sid, options).then((devicelist) => {
                        devicelist.should.be.an('array');
                        cfg.getDevicelistInfoStub().should.have.been.calledOnce;
                        fritzapi.getDeviceListVersion(sid, options).then((version) => {
                            cfg.readValue(['devicelist', 'version']).should.be.equal(version);
                        }).then(done, done);
                    });
                })
            });
        }
    });
})