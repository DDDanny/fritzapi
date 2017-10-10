# Unittest suite for fritzapi

Static code tests are done via <img src="http://jslint.com/image/jslintpill.gif" height="17px"/> [JSLint](http://jslint.com/) - these tests will be carried out always via `npm test` *pretest* and before *travis before_install*. They are not part of the unit tests/this document. Test is used in this document to referer to a unit test.

## basics

Tests can be configured via `config.js` to run as
* dev: (default) The unit tests will run against fixed XML `devicelist_dev.xml` that provides a reply of devices to test `get`-functions, so you need no fritz.box and no login data. This is the default setting for running the test via e.g. `npm test` and is involved in *travis before_script*.
* custom: You can procide a XML (default `devicelist_custom.xml`) and specify your expactions in the `config.js`.
* live: Tests will be carried out with live data from a fritz.box with provided credentials. The same expactions as for custom will be used - this can be configured. If you develop always **ensure that you remove your credentials from the `config.js**

All tests cover both API functionallity
* Functional API
* OO based API

Tests are performed via <img src="http://cldup.com/xFVFxOioAU.svg" height="17px"/> [mocha](http://mochajs.org/). 
Test design via <img src="http://sinonjs.org/assets/images/logo.png" height="17px"/> [sinon](http://sinonjs.org/) and <img src="http://chaijs.com/img/chai-logo.png" height="17px"/> [chai](http://chaijs.com/) and chai plugin [sinon-chai](http://chaijs.com/plugins/sinon-chai/) *DevHint* Testing promisified functions `require('bluebird')` and assign to sinon `usingPromise(bluebird.Promise)`.

Test files are suffixed with `.spec.js` and homed in folder `./test`. Files are added automatically to suite via package.json `"test": "NODE_ENV=test mocha './test/**/*.spec.js'"`
Stubbed XML `devicelist_cache_stub.xml` is to test (devicelist/device) caching 

*Test coverage* will be checked via <img src="https://istanbul.js.org/assets/istanbul-logo.png" height="17px"/> [istanbul](https://github.com/gotwarlost/istanbul) (*travis after_success* and `npm test` *posttest*).

## Stub

### Testcases:
- [x] **bitfunctions**: Check that all bit functions provide a value different from 0. [Extend on new bitfunction(s)]
- [x] **devicelist**: Test against stubbed or live XML Info. [extend on new device]
- [x] **getListByFunction**: Test the generic `getListByFunction` and all related functions like `getSwitchList` and `getValveList` etc. [extend on new devicetypes]
- [x] **internals**: check internal used functions for exepcted baviour -> 2do `executeCommand` `httpRequest`

- [x] device: getDevice
- [x] devicename: getDeviceName 
- [x] deviceid: getDeviceId

- [ ] sid: getSID


- [ ] devicelistinfo: getDeviceListInfo

- [ ] temperature: getTemperature
- [ ] presence: getPresence

- [ ] switch: getSwitchState
- [ ] getSwitchEnergy
- [ ] getSwitchPower
- [ ] getSwitchPresence
- [ ] getSwitchName

- [ ] getTempTarget
- [ ] getTempNight
- [ ] getTempComfort

- [ ] setSwitchOn
- [ ] setSwitchOff
- [ ] setTempTarget

- [ ] getBatteryCharge

- [ ] osversion: getOSVersion
- [ ] setGuestWlan
- [ ] getGuestWlan
