# Unittest suite for fritzapi

Static code tests are done via <img src="http://jslint.com/image/jslintpill.gif" height="17px"/> [JSLint](http://jslint.com/) - these tests will be carried out always via `npm test` *pretest* and before *travis before_install*. They are not part of the unit tests/this document. Test is used in this document to referer to a unit test.

## basics

All tests are devided into two main approaches.
* stub-test: The unit tests will run against stubbed XML list to test `get`-functions, so you need no fritz.box and no login data. This is the default setting for running the test via e.g. `npm test` and is involved in *travis before_script*.
* {2do} live-test: Tests will be carried out with live data from a fritz.box with provided credentials. If you develop always ensure that you `.gitignore` the live-test config!

All tests should cover both API functionallity
* Functional API
* {2do} OO based API

Tests are performed via <img src="http://cldup.com/xFVFxOioAU.svg" height="17px"/> [mocha](http://mochajs.org/). 
Test design via <img src="http://sinonjs.org/assets/images/logo.png" height="17px"/> [sinon](http://sinonjs.org/) and <img src="http://chaijs.com/img/chai-logo.png" height="17px"/> [chai](http://chaijs.com/) and chai plugin [sinon-chai](http://chaijs.com/plugins/sinon-chai/) *DevHint* Testing promisified functions `require('bluebird')` and assign to sinon `usingPromise(bluebird.Promise)`.

Test files are suffixed with `.spec.js` and homed in folder `./test`. Files are added automatically to suite via package.json `"test": "NODE_ENV=test mocha './test/**/*.spec.js'"`
Stubbed XML `devicelist_cache_stub.xml` is to test (devicelist/device) caching 

*Test coverage* will be checked via <img src="https://istanbul.js.org/assets/istanbul-logo.png" height="17px"/> [istanbul](https://github.com/gotwarlost/istanbul) (*travis after_success* and `npm test` *posttest*).

## Stub

### Testcases:
- [x] **bitfunctions**: Check that all bit functions provide a value different from 0. Wxtend on new bitfunction(s)
- [x] **devicelist**: Load the (currently two) stubbed XML files and carry out devcelist specific tests.
- [x] **getListByFunction**: Test the generic `getListByFunction` and all related functions like `getSwitchList` and `getValveList` etc. extend on new devicetypes
- [x] **internals**: check internal used functions for exepcted baviour

- [ ] device: getDevice
- [ ] devicename: getDeviceName 


- [ ] sid: getSID

- [ ] osversion: getOSVersion

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
- [ ] getBatteryCharge
- [ ] getGuestWlan

- [ ] setSwitchOn
- [ ] setSwitchOff
- [ ] setTempTarget
- [ ] setGuestWlan
