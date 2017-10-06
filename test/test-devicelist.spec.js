"use strict";
/* jshint esversion: 6 */
/* jslint node: true */
/*global describe, it, before, beforeEach, after, afterEach */

/*
 *  testing of devicelist
 */

const cfg = require('./config');

const sinon = require('sinon');

const chai = require('chai');

const sinonChai = require('sinon-chai'), should = chai.should();
chai.use(sinonChai);

var fritzapi = require('../index');
var fritz;

describe('.getDeviceList [' + cfg.getTestmode() + ']', function () {
    describe('functional-api', function () {
        if (!cfg.isLiveTest()) { //non - live
            it('with stubbed', (done) => {
                fritzapi.getDeviceList().then( (devicelist) => {
                    devicelist.should.be.an('array');
                    var test = cfg.getDevicelistInfoSinon().should.have.been.calledOnce;
                    fritzapi.getDeviceListVersion().then( (version) => {
                        cfg.readValue(['devicelist', 'version']).should.be.equal(version);
                    }).then(done, done);
                });
            });
        } else {
            it('from fritz.box', (done) => {
                var options = cfg.readValue(['options']);
                fritzapi.getSessionID(cfg.readValue(['user']), cfg.readValue(['pwd']), options).then((sid) => {
                    fritzapi.getDeviceList(sid, options).then((devicelist) => {
                        devicelist.should.be.an('array');
                        var test = cfg.getDevicelistInfoStub().should.have.been.calledTwice;
                        fritzapi.getDeviceListVersion(sid, options).then((version) => {
                            cfg.readValue(['devicelist', 'version']).should.be.equal(version);
                        }).then(done, done);
                    });
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
              fritz = new fritzapi.Fritz(cfg.readValue(['user']), cfg.readValue(['pwd']), cfg.readValue(['options']).url);  
            }
        });
        afterEach(() => {
            fritz = null;
        });
        it('receive devices', (done) => { //independent from login data :-)
            fritz.getDeviceList(cfg.readValue(['options'])).then( (devicelist) => {
                devicelist.should.be.an('array');
                var test = cfg.getDevicelistInfoSinon().should.have.been.calledOnce;
                fritz.getDeviceListVersion().then( (version) => {
                    cfg.readValue(['devicelist', 'version']).should.be.equal(version);
                }).then(done, done);
            });
        });
    });
});