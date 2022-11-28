"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setupRegistrar = setupRegistrar;
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _ethers = require("ethers");

var _web = _interopRequireDefault(require("web3"));

var _addresses = require("./constants/addresses");

var _interfaces = require("./constants/interfaces");

var _contracts = require("./contracts");

var _dnsregistrar = _interopRequireDefault(require("./dnsregistrar"));

var _labelhash = require("./utils/labelhash");

var _namehash = require("./utils/namehash");

var _web2 = require("./web3");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var legacyRegistrarInterfaceId = _interfaces.interfaces.legacyRegistrar,
    permanentRegistrarInterfaceId = _interfaces.interfaces.permanentRegistrar,
    bulkRenewalInterfaceId = _interfaces.interfaces.bulkRenewal,
    dnsRegistrarInterfaceId = _interfaces.interfaces.dnsRegistrar,
    dnssecClaimOldId = _interfaces.interfaces.dnssecClaimOld,
    dnssecClaimNewId = _interfaces.interfaces.dnssecClaimNew; // Renewal seem failing as it's not correctly estimating gas to return when buffer exceeds the renewal cost

var transferGasCost = 21000;

function checkArguments(_ref) {
  var registryAddress = _ref.registryAddress,
      ethAddress = _ref.ethAddress,
      legacyAuctionRegistrarAddress = _ref.legacyAuctionRegistrarAddress,
      provider = _ref.provider;
  if (!registryAddress) throw 'No registry address given to Registrar class';
  if (!legacyAuctionRegistrarAddress) throw 'No legacy auction address given to Registrar class';
  if (!ethAddress) throw 'No .arb address given to Registrar class';
  if (!provider) throw 'Provider is required for Registrar';
  return;
} // Add 10% buffer to handle price fructuation.
// Any unused value will be sent back by the smart contract.


function getBufferedPrice(price) {
  return price.mul(110).div(100);
}

var Registrar = /*#__PURE__*/function () {
  function Registrar(_ref2) {
    var registryAddress = _ref2.registryAddress,
        ethAddress = _ref2.ethAddress,
        legacyAuctionRegistrarAddress = _ref2.legacyAuctionRegistrarAddress,
        controllerAddress = _ref2.controllerAddress,
        bulkRenewalAddress = _ref2.bulkRenewalAddress,
        provider = _ref2.provider;
    (0, _classCallCheck2["default"])(this, Registrar);
    checkArguments({
      registryAddress: registryAddress,
      ethAddress: ethAddress,
      legacyAuctionRegistrarAddress: legacyAuctionRegistrarAddress,
      provider: provider
    });
    var permanentRegistrar = (0, _contracts.getPermanentRegistrarContract)({
      address: _addresses.PERMANENT_REGISTRAR_ADDRESS,
      provider: provider
    });
    var permanentRegistrarController = (0, _contracts.getPermanentRegistrarControllerContract)({
      address: controllerAddress,
      provider: provider
    });
    var legacyAuctionRegistrar = (0, _contracts.getLegacyAuctionContract)({
      address: legacyAuctionRegistrarAddress,
      provider: provider
    });
    var bulkRenewal = (0, _contracts.getBulkRenewalContract)({
      address: bulkRenewalAddress,
      provider: provider
    });
    var ENS = (0, _contracts.getENSContract)({
      address: registryAddress,
      provider: provider
    });
    this.permanentRegistrar = permanentRegistrar;
    this.permanentRegistrarController = permanentRegistrarController;
    this.legacyAuctionRegistrar = legacyAuctionRegistrar;
    this.registryAddress = registryAddress;
    this.bulkRenewal = bulkRenewal;
    this.ENS = ENS;
  }

  (0, _createClass2["default"])(Registrar, [{
    key: "getAddress",
    value: function () {
      var _getAddress = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(name) {
        var provider, hash, Resolver;
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (!(name === 'resolver.arb')) {
                  _context.next = 2;
                  break;
                }

                return _context.abrupt("return", _addresses.RESOLVER_ADDRESS);

              case 2:
                _context.next = 4;
                return (0, _web2.getProvider)();

              case 4:
                provider = _context.sent;
                hash = (0, _namehash.namehash)(name); // const resolverAddr = await this.ENS.resolver(hash)

                Resolver = (0, _contracts.getResolverContract)({
                  address: _addresses.RESOLVER_ADDRESS,
                  provider: provider
                });
                return _context.abrupt("return", Resolver['addr(bytes32)'](hash));

              case 8:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      function getAddress(_x) {
        return _getAddress.apply(this, arguments);
      }

      return getAddress;
    }()
  }, {
    key: "getText",
    value: function () {
      var _getText = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(name, key) {
        var provider, hash, Resolver;
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return (0, _web2.getProvider)();

              case 2:
                provider = _context2.sent;
                hash = (0, _namehash.namehash)(name); // const resolverAddr = await this.ENS.resolver(hash)

                Resolver = (0, _contracts.getResolverContract)({
                  address: _addresses.RESOLVER_ADDRESS,
                  provider: provider
                });
                return _context2.abrupt("return", Resolver.text(hash, key));

              case 6:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));

      function getText(_x2, _x3) {
        return _getText.apply(this, arguments);
      }

      return getText;
    }()
  }, {
    key: "getDeed",
    value: function () {
      var _getDeed = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(address) {
        var provider;
        return _regenerator["default"].wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.next = 2;
                return (0, _web2.getProvider)();

              case 2:
                provider = _context3.sent;
                return _context3.abrupt("return", (0, _contracts.getDeedContract)({
                  address: address,
                  provider: provider
                }));

              case 4:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3);
      }));

      function getDeed(_x4) {
        return _getDeed.apply(this, arguments);
      }

      return getDeed;
    }()
  }, {
    key: "getOracle",
    value: function () {
      var _getOracle = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(address) {
        var provider;
        return _regenerator["default"].wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.next = 2;
                return (0, _web2.getProvider)();

              case 2:
                provider = _context4.sent;
                return _context4.abrupt("return", (0, _contracts.getOracleContract)({
                  address: address,
                  provider: provider
                }));

              case 4:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4);
      }));

      function getOracle(_x5) {
        return _getOracle.apply(this, arguments);
      }

      return getOracle;
    }()
  }, {
    key: "getLegacyEntry",
    value: function () {
      var _getLegacyEntry = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(label) {
        var legacyEntry, _Registrar6, deedOwner, entry, deed;

        return _regenerator["default"].wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                _context5.prev = 0;
                _Registrar6 = this.legacyAuctionRegistrar;
                deedOwner = '0x0';
                _context5.next = 5;
                return _Registrar6.entries((0, _labelhash.labelhash)(label));

              case 5:
                entry = _context5.sent;

                if (!(parseInt(entry[1], 16) !== 0)) {
                  _context5.next = 13;
                  break;
                }

                _context5.next = 9;
                return this.getDeed(entry[1]);

              case 9:
                deed = _context5.sent;
                _context5.next = 12;
                return deed.owner();

              case 12:
                deedOwner = _context5.sent;

              case 13:
                legacyEntry = {
                  deedOwner: deedOwner,
                  // TODO: Display "Release" button if deedOwner is not 0x0
                  state: parseInt(entry[0]),
                  registrationDate: parseInt(entry[2]) * 1000,
                  revealDate: (parseInt(entry[2]) - 24 * 2 * 60 * 60) * 1000,
                  value: parseInt(entry[3]),
                  highestBid: parseInt(entry[4])
                };
                _context5.next = 19;
                break;

              case 16:
                _context5.prev = 16;
                _context5.t0 = _context5["catch"](0);
                legacyEntry = {
                  deedOwner: '0x0',
                  state: 0,
                  registrationDate: 0,
                  revealDate: 0,
                  value: 0,
                  highestBid: 0,
                  expiryTime: 0,
                  error: _context5.t0.message
                };

              case 19:
                return _context5.abrupt("return", legacyEntry);

              case 20:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, this, [[0, 16]]);
      }));

      function getLegacyEntry(_x6) {
        return _getLegacyEntry.apply(this, arguments);
      }

      return getLegacyEntry;
    }()
  }, {
    key: "getPermanentEntry",
    value: function () {
      var _getPermanentEntry = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(label) {
        var _Registrar2, RegistrarController, getAvailable, ret, labelHash, _yield$Promise$all, _yield$Promise$all2, available, nameExpires, gracePeriod;

        return _regenerator["default"].wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                _Registrar2 = this.permanentRegistrar, RegistrarController = this.permanentRegistrarController;
                ret = {
                  available: null,
                  nameExpires: null
                };
                _context6.prev = 2;
                labelHash = (0, _labelhash.labelhash)(label);
                _context6.next = 6;
                return Promise.all([RegistrarController.available(label), _Registrar2.nameExpires(labelHash), this.getGracePeriod(_Registrar2)]);

              case 6:
                _yield$Promise$all = _context6.sent;
                _yield$Promise$all2 = (0, _slicedToArray2["default"])(_yield$Promise$all, 3);
                available = _yield$Promise$all2[0];
                nameExpires = _yield$Promise$all2[1];
                gracePeriod = _yield$Promise$all2[2];
                ret = _objectSpread(_objectSpread({}, ret), {}, {
                  available: available,
                  gracePeriod: gracePeriod,
                  nameExpires: nameExpires > 0 ? new Date(nameExpires * 1000) : null
                }); // Returns registrar address if owned by new registrar.
                // Keep it as a separate call as this will throw exception for non existing domains
                // TODO: uncomment when domains are ready (see above)
                // ret.ownerOf = await Registrar.ownerOf(labelHash)

                _context6.next = 17;
                break;

              case 14:
                _context6.prev = 14;
                _context6.t0 = _context6["catch"](2);
                return _context6.abrupt("return", false);

              case 17:
                _context6.prev = 17;
                return _context6.abrupt("return", ret);

              case 20:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6, this, [[2, 14, 17, 20]]);
      }));

      function getPermanentEntry(_x7) {
        return _getPermanentEntry.apply(this, arguments);
      }

      return getPermanentEntry;
    }()
  }, {
    key: "getEntry",
    value: function () {
      var _getEntry = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7(label) {
        var _yield$Promise$all3, _yield$Promise$all4, block, legacyEntry, permEntry, ret, currentTime, gracePeriodEndDate;

        return _regenerator["default"].wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                _context7.next = 2;
                return Promise.all([(0, _web2.getBlock)(), this.getLegacyEntry(label), this.getPermanentEntry(label)]);

              case 2:
                _yield$Promise$all3 = _context7.sent;
                _yield$Promise$all4 = (0, _slicedToArray2["default"])(_yield$Promise$all3, 3);
                block = _yield$Promise$all4[0];
                legacyEntry = _yield$Promise$all4[1];
                permEntry = _yield$Promise$all4[2];
                ret = {
                  currentBlockDate: new Date(block.timestamp * 1000),
                  registrant: 0,
                  transferEndDate: null,
                  isNewRegistrar: false,
                  gracePeriodEndDate: null
                };

                if (permEntry) {
                  ret.available = permEntry.available;

                  if (permEntry.nameExpires) {
                    ret.expiryTime = permEntry.nameExpires;
                  }

                  if (permEntry.ownerOf) {
                    ret.registrant = permEntry.ownerOf;
                    ret.isNewRegistrar = true;
                  } else if (permEntry.nameExpires) {
                    currentTime = new Date(ret.currentBlockDate);
                    gracePeriodEndDate = new Date(permEntry.nameExpires.getTime() + permEntry.gracePeriod * 1000); // It is within grace period

                    if (permEntry.nameExpires < currentTime < gracePeriodEndDate) {
                      ret.isNewRegistrar = true;
                      ret.gracePeriodEndDate = gracePeriodEndDate;
                    }
                  }
                }

                return _context7.abrupt("return", _objectSpread(_objectSpread({}, legacyEntry), ret));

              case 10:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7, this);
      }));

      function getEntry(_x8) {
        return _getEntry.apply(this, arguments);
      }

      return getEntry;
    }()
  }, {
    key: "getGracePeriod",
    value: function () {
      var _getGracePeriod = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee8(_Registrar3) {
        return _regenerator["default"].wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                if (this.gracePeriod) {
                  _context8.next = 5;
                  break;
                }

                _context8.next = 3;
                return _Registrar3.GRACE_PERIOD();

              case 3:
                this.gracePeriod = _context8.sent;
                return _context8.abrupt("return", this.gracePeriod);

              case 5:
                return _context8.abrupt("return", this.gracePeriod);

              case 6:
              case "end":
                return _context8.stop();
            }
          }
        }, _callee8, this);
      }));

      function getGracePeriod(_x9) {
        return _getGracePeriod.apply(this, arguments);
      }

      return getGracePeriod;
    }()
  }, {
    key: "transferOwner",
    value: function () {
      var _transferOwner = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee9(name, to) {
        var overrides,
            nameArray,
            labelHash,
            account,
            permanentRegistrar,
            signer,
            _Registrar7,
            networkId,
            gas,
            _args9 = arguments;

        return _regenerator["default"].wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                overrides = _args9.length > 2 && _args9[2] !== undefined ? _args9[2] : {};
                _context9.prev = 1;
                nameArray = name.split('.');
                labelHash = (0, _labelhash.labelhash)(nameArray[0]);
                _context9.next = 6;
                return (0, _web2.getAccount)();

              case 6:
                account = _context9.sent;
                permanentRegistrar = this.permanentRegistrar;
                _context9.next = 10;
                return (0, _web2.getSigner)();

              case 10:
                signer = _context9.sent;
                _Registrar7 = permanentRegistrar.connect(signer);
                _context9.next = 14;
                return (0, _web2.getNetworkId)();

              case 14:
                networkId = _context9.sent;

                if (!(parseInt(networkId) > 1000)) {
                  _context9.next = 20;
                  break;
                }

                _context9.next = 18;
                return _Registrar7.estimateGas['safeTransferFrom(address,address,uint256)'](account, to, labelHash);

              case 18:
                gas = _context9.sent;
                overrides = _objectSpread(_objectSpread({}, overrides), {}, {
                  gasLimit: gas.toNumber() * 2
                });

              case 20:
                return _context9.abrupt("return", _Registrar7['safeTransferFrom(address,address,uint256)'](account, to, labelHash, overrides));

              case 23:
                _context9.prev = 23;
                _context9.t0 = _context9["catch"](1);
                console.log('Error calling transferOwner', _context9.t0);

              case 26:
              case "end":
                return _context9.stop();
            }
          }
        }, _callee9, this, [[1, 23]]);
      }));

      function transferOwner(_x10, _x11) {
        return _transferOwner.apply(this, arguments);
      }

      return transferOwner;
    }()
  }, {
    key: "reclaim",
    value: function () {
      var _reclaim = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee10(name, address) {
        var overrides,
            nameArray,
            labelHash,
            permanentRegistrar,
            signer,
            _Registrar8,
            networkId,
            gas,
            _args10 = arguments;

        return _regenerator["default"].wrap(function _callee10$(_context10) {
          while (1) {
            switch (_context10.prev = _context10.next) {
              case 0:
                overrides = _args10.length > 2 && _args10[2] !== undefined ? _args10[2] : {};
                _context10.prev = 1;
                nameArray = name.split('.');
                labelHash = (0, _labelhash.labelhash)(nameArray[0]);
                permanentRegistrar = this.permanentRegistrar;
                _context10.next = 7;
                return (0, _web2.getSigner)();

              case 7:
                signer = _context10.sent;
                _Registrar8 = permanentRegistrar.connect(signer);
                _context10.next = 11;
                return (0, _web2.getNetworkId)();

              case 11:
                networkId = _context10.sent;

                if (!(parseInt(networkId) > 1000)) {
                  _context10.next = 17;
                  break;
                }

                _context10.next = 15;
                return _Registrar8.estimateGas.reclaim(labelHash, address);

              case 15:
                gas = _context10.sent;
                overrides = _objectSpread(_objectSpread({}, overrides), {}, {
                  gasLimit: gas.toNumber() * 2
                });

              case 17:
                return _context10.abrupt("return", _Registrar8.reclaim(labelHash, address, _objectSpread({}, overrides)));

              case 20:
                _context10.prev = 20;
                _context10.t0 = _context10["catch"](1);
                console.log('Error calling reclaim', _context10.t0);

              case 23:
              case "end":
                return _context10.stop();
            }
          }
        }, _callee10, this, [[1, 20]]);
      }));

      function reclaim(_x12, _x13) {
        return _reclaim.apply(this, arguments);
      }

      return reclaim;
    }()
  }, {
    key: "getRentPrice",
    value: function () {
      var _getRentPrice = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee11(name, duration) {
        var permanentRegistrarController, price;
        return _regenerator["default"].wrap(function _callee11$(_context11) {
          while (1) {
            switch (_context11.prev = _context11.next) {
              case 0:
                permanentRegistrarController = this.permanentRegistrarController;
                _context11.next = 3;
                return permanentRegistrarController.rentPrice(name, duration);

              case 3:
                price = _context11.sent;
                return _context11.abrupt("return", price);

              case 5:
              case "end":
                return _context11.stop();
            }
          }
        }, _callee11, this);
      }));

      function getRentPrice(_x14, _x15) {
        return _getRentPrice.apply(this, arguments);
      }

      return getRentPrice;
    }()
  }, {
    key: "getRentPriceAndPremium",
    value: function () {
      var _getRentPriceAndPremium = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee12(name, duration) {
        var block,
            permanentRegistrarController,
            price,
            premium,
            _args12 = arguments;
        return _regenerator["default"].wrap(function _callee12$(_context12) {
          while (1) {
            switch (_context12.prev = _context12.next) {
              case 0:
                block = _args12.length > 2 && _args12[2] !== undefined ? _args12[2] : "latest";
                permanentRegistrarController = this.permanentRegistrarController;
                _context12.next = 4;
                return permanentRegistrarController.rentPrice(name, duration, {
                  blockTag: block
                });

              case 4:
                price = _context12.sent;
                _context12.next = 7;
                return permanentRegistrarController.rentPrice(name, 0, {
                  blockTag: block
                });

              case 7:
                premium = _context12.sent;
                return _context12.abrupt("return", {
                  price: price,
                  premium: premium
                });

              case 9:
              case "end":
                return _context12.stop();
            }
          }
        }, _callee12, this);
      }));

      function getRentPriceAndPremium(_x16, _x17) {
        return _getRentPriceAndPremium.apply(this, arguments);
      }

      return getRentPriceAndPremium;
    }()
  }, {
    key: "getEthPrice",
    value: function () {
      var _getEthPrice = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee13() {
        var oracleens, contractAddress, oracle;
        return _regenerator["default"].wrap(function _callee13$(_context13) {
          while (1) {
            switch (_context13.prev = _context13.next) {
              case 0:
                oracleens = 'eth-usd.data.eth';
                _context13.prev = 1;
                _context13.next = 4;
                return this.getAddress(oracleens);

              case 4:
                contractAddress = _context13.sent;
                _context13.next = 7;
                return this.getOracle(contractAddress);

              case 7:
                oracle = _context13.sent;
                _context13.next = 10;
                return oracle.latestAnswer();

              case 10:
                _context13.t0 = _context13.sent.toNumber();
                return _context13.abrupt("return", _context13.t0 / 100000000);

              case 14:
                _context13.prev = 14;
                _context13.t1 = _context13["catch"](1);
                console.warn("Either ".concat(oracleens, " does not exist or Oracle is not throwing an error"), _context13.t1);

              case 17:
              case "end":
                return _context13.stop();
            }
          }
        }, _callee13, this, [[1, 14]]);
      }));

      function getEthPrice() {
        return _getEthPrice.apply(this, arguments);
      }

      return getEthPrice;
    }()
  }, {
    key: "getPriceCurve",
    value: function () {
      var _getPriceCurve = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee14() {
        return _regenerator["default"].wrap(function _callee14$(_context14) {
          while (1) {
            switch (_context14.prev = _context14.next) {
              case 0:
                _context14.prev = 0;
                return _context14.abrupt("return", this.getText('arb', 'oracle'));

              case 4:
                _context14.prev = 4;
                _context14.t0 = _context14["catch"](0);
                return _context14.abrupt("return", 'linear');

              case 7:
              case "end":
                return _context14.stop();
            }
          }
        }, _callee14, this, [[0, 4]]);
      }));

      function getPriceCurve() {
        return _getPriceCurve.apply(this, arguments);
      }

      return getPriceCurve;
    }()
  }, {
    key: "getRentPrices",
    value: function () {
      var _getRentPrices = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee15(labels, duration) {
        var _this = this;

        var pricesArray;
        return _regenerator["default"].wrap(function _callee15$(_context15) {
          while (1) {
            switch (_context15.prev = _context15.next) {
              case 0:
                _context15.next = 2;
                return Promise.all(labels.map(function (label) {
                  return _this.getRentPrice(label, duration);
                }));

              case 2:
                pricesArray = _context15.sent;
                return _context15.abrupt("return", pricesArray.reduce(function (a, c) {
                  return a.add(c);
                }));

              case 4:
              case "end":
                return _context15.stop();
            }
          }
        }, _callee15);
      }));

      function getRentPrices(_x18, _x19) {
        return _getRentPrices.apply(this, arguments);
      }

      return getRentPrices;
    }()
  }, {
    key: "getMinimumCommitmentAge",
    value: function () {
      var _getMinimumCommitmentAge = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee16() {
        var permanentRegistrarController;
        return _regenerator["default"].wrap(function _callee16$(_context16) {
          while (1) {
            switch (_context16.prev = _context16.next) {
              case 0:
                permanentRegistrarController = this.permanentRegistrarController;
                return _context16.abrupt("return", permanentRegistrarController.minCommitmentAge());

              case 2:
              case "end":
                return _context16.stop();
            }
          }
        }, _callee16, this);
      }));

      function getMinimumCommitmentAge() {
        return _getMinimumCommitmentAge.apply(this, arguments);
      }

      return getMinimumCommitmentAge;
    }()
  }, {
    key: "getMaximumCommitmentAge",
    value: function () {
      var _getMaximumCommitmentAge = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee17() {
        var permanentRegistrarController;
        return _regenerator["default"].wrap(function _callee17$(_context17) {
          while (1) {
            switch (_context17.prev = _context17.next) {
              case 0:
                permanentRegistrarController = this.permanentRegistrarController;
                return _context17.abrupt("return", permanentRegistrarController.maxCommitmentAge());

              case 2:
              case "end":
                return _context17.stop();
            }
          }
        }, _callee17, this);
      }));

      function getMaximumCommitmentAge() {
        return _getMaximumCommitmentAge.apply(this, arguments);
      }

      return getMaximumCommitmentAge;
    }()
  }, {
    key: "makeCommitment",
    value: function () {
      var _makeCommitment = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee18(name, owner) {
        var secret,
            permanentRegistrarControllerWithoutSigner,
            signer,
            permanentRegistrarController,
            account,
            resolverAddr,
            result,
            _args18 = arguments;
        return _regenerator["default"].wrap(function _callee18$(_context18) {
          while (1) {
            switch (_context18.prev = _context18.next) {
              case 0:
                secret = _args18.length > 2 && _args18[2] !== undefined ? _args18[2] : '';
                permanentRegistrarControllerWithoutSigner = this.permanentRegistrarController;
                _context18.next = 4;
                return (0, _web2.getSigner)();

              case 4:
                signer = _context18.sent;
                permanentRegistrarController = permanentRegistrarControllerWithoutSigner.connect(signer);
                _context18.next = 8;
                return (0, _web2.getAccount)();

              case 8:
                account = _context18.sent;
                _context18.next = 11;
                return this.getAddress('resolver.arb');

              case 11:
                resolverAddr = _context18.sent;

                if (!(parseInt(resolverAddr, 16) === 0)) {
                  _context18.next = 24;
                  break;
                }

                _context18.prev = 13;
                _context18.next = 16;
                return permanentRegistrarController.makeCommitment(name, owner, secret);

              case 16:
                result = _context18.sent;
                _context18.next = 22;
                break;

              case 19:
                _context18.prev = 19;
                _context18.t0 = _context18["catch"](13);
                result = _web["default"].utils.soliditySha3({
                  type: 'string',
                  value: name
                }, {
                  type: 'address',
                  value: owner
                }, {
                  type: 'bytes32',
                  value: secret
                });

              case 22:
                _context18.next = 33;
                break;

              case 24:
                _context18.prev = 24;
                _context18.next = 27;
                return permanentRegistrarController.makeCommitmentWithConfig(name, owner, secret, resolverAddr, account);

              case 27:
                result = _context18.sent;
                _context18.next = 33;
                break;

              case 30:
                _context18.prev = 30;
                _context18.t1 = _context18["catch"](24);
                result = _web["default"].utils.soliditySha3({
                  type: 'string',
                  value: name
                }, {
                  type: 'address',
                  value: owner
                }, {
                  type: 'address',
                  value: resolverAddr
                }, {
                  type: 'address',
                  value: account
                }, {
                  type: 'bytes32',
                  value: secret
                });

              case 33:
                return _context18.abrupt("return", result);

              case 34:
              case "end":
                return _context18.stop();
            }
          }
        }, _callee18, this, [[13, 19], [24, 30]]);
      }));

      function makeCommitment(_x20, _x21) {
        return _makeCommitment.apply(this, arguments);
      }

      return makeCommitment;
    }()
  }, {
    key: "checkCommitment",
    value: function () {
      var _checkCommitment = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee19(label) {
        var secret,
            permanentRegistrarControllerWithoutSigner,
            signer,
            permanentRegistrarController,
            account,
            commitment,
            result,
            _args19 = arguments;
        return _regenerator["default"].wrap(function _callee19$(_context19) {
          while (1) {
            switch (_context19.prev = _context19.next) {
              case 0:
                secret = _args19.length > 1 && _args19[1] !== undefined ? _args19[1] : '';
                permanentRegistrarControllerWithoutSigner = this.permanentRegistrarController;
                _context19.next = 4;
                return (0, _web2.getSigner)();

              case 4:
                signer = _context19.sent;
                permanentRegistrarController = permanentRegistrarControllerWithoutSigner.connect(signer);
                _context19.next = 8;
                return (0, _web2.getAccount)();

              case 8:
                account = _context19.sent;
                _context19.prev = 9;
                _context19.next = 12;
                return this.makeCommitment(label, account, secret);

              case 12:
                commitment = _context19.sent;
                _context19.next = 18;
                break;

              case 15:
                _context19.prev = 15;
                _context19.t0 = _context19["catch"](9);
                commitment = '';

              case 18:
                _context19.next = 20;
                return permanentRegistrarController.commitments(commitment);

              case 20:
                result = _context19.sent;
                return _context19.abrupt("return", result);

              case 22:
              case "end":
                return _context19.stop();
            }
          }
        }, _callee19, this, [[9, 15]]);
      }));

      function checkCommitment(_x22) {
        return _checkCommitment.apply(this, arguments);
      }

      return checkCommitment;
    }()
  }, {
    key: "commit",
    value: function () {
      var _commit = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee20(label) {
        var secret,
            permanentRegistrarControllerWithoutSigner,
            signer,
            permanentRegistrarController,
            account,
            commitment,
            _args20 = arguments;
        return _regenerator["default"].wrap(function _callee20$(_context20) {
          while (1) {
            switch (_context20.prev = _context20.next) {
              case 0:
                secret = _args20.length > 1 && _args20[1] !== undefined ? _args20[1] : '';
                permanentRegistrarControllerWithoutSigner = this.permanentRegistrarController;
                _context20.next = 4;
                return (0, _web2.getSigner)();

              case 4:
                signer = _context20.sent;
                permanentRegistrarController = permanentRegistrarControllerWithoutSigner.connect(signer);
                _context20.next = 8;
                return (0, _web2.getAccount)();

              case 8:
                account = _context20.sent;
                _context20.prev = 9;
                _context20.next = 12;
                return this.makeCommitment(label, account, secret);

              case 12:
                commitment = _context20.sent;
                _context20.next = 18;
                break;

              case 15:
                _context20.prev = 15;
                _context20.t0 = _context20["catch"](9);
                commitment = '';

              case 18:
                return _context20.abrupt("return", permanentRegistrarController.commit(commitment));

              case 19:
              case "end":
                return _context20.stop();
            }
          }
        }, _callee20, this, [[9, 15]]);
      }));

      function commit(_x23) {
        return _commit.apply(this, arguments);
      }

      return commit;
    }()
  }, {
    key: "register",
    value: function () {
      var _register = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee21(label, duration, secret) {
        var permanentRegistrarControllerWithoutSigner, signer, permanentRegistrarController, account, price, priceWithBuffer, resolverAddr, gasLimit, _gasLimit;

        return _regenerator["default"].wrap(function _callee21$(_context21) {
          while (1) {
            switch (_context21.prev = _context21.next) {
              case 0:
                permanentRegistrarControllerWithoutSigner = this.permanentRegistrarController;
                _context21.next = 3;
                return (0, _web2.getSigner)();

              case 3:
                signer = _context21.sent;
                permanentRegistrarController = permanentRegistrarControllerWithoutSigner.connect(signer);
                _context21.next = 7;
                return (0, _web2.getAccount)();

              case 7:
                account = _context21.sent;
                _context21.next = 10;
                return this.getRentPrice(label, duration);

              case 10:
                price = _context21.sent;
                priceWithBuffer = getBufferedPrice(price);
                _context21.next = 14;
                return this.getAddress('resolver.arb');

              case 14:
                resolverAddr = _context21.sent;

                if (!(parseInt(resolverAddr, 16) === 0)) {
                  _context21.next = 22;
                  break;
                }

                _context21.next = 18;
                return this.estimateGasLimit(function () {
                  return permanentRegistrarController.estimateGas.register(label, account, duration, secret, {
                    value: priceWithBuffer
                  });
                });

              case 18:
                gasLimit = _context21.sent;
                return _context21.abrupt("return", permanentRegistrarController.register(label, account, duration, secret, {
                  value: priceWithBuffer,
                  gasLimit: gasLimit
                }));

              case 22:
                _context21.next = 24;
                return this.estimateGasLimit(function () {
                  return permanentRegistrarController.estimateGas.registerWithConfig(label, account, duration, secret, resolverAddr, account, {
                    value: priceWithBuffer
                  });
                });

              case 24:
                _gasLimit = _context21.sent;
                return _context21.abrupt("return", permanentRegistrarController.registerWithConfig(label, account, duration, secret, resolverAddr, account, {
                  value: priceWithBuffer,
                  gasLimit: _gasLimit
                }));

              case 26:
              case "end":
                return _context21.stop();
            }
          }
        }, _callee21, this);
      }));

      function register(_x24, _x25, _x26) {
        return _register.apply(this, arguments);
      }

      return register;
    }()
  }, {
    key: "estimateGasLimit",
    value: function () {
      var _estimateGasLimit = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee22(cb) {
        var gas, matched;
        return _regenerator["default"].wrap(function _callee22$(_context22) {
          while (1) {
            switch (_context22.prev = _context22.next) {
              case 0:
                gas = 0;
                _context22.prev = 1;
                _context22.next = 4;
                return cb();

              case 4:
                gas = _context22.sent.toNumber();
                _context22.next = 12;
                break;

              case 7:
                _context22.prev = 7;
                _context22.t0 = _context22["catch"](1);
                matched = _context22.t0.message.match(/\(supplied gas (.*)\)/) || _context22.t0.message.match(/\(gas required exceeds allowance (.*)\)/);

                if (matched) {
                  gas = parseInt(matched[1]);
                }

                console.log({
                  gas: gas,
                  e: _context22.t0,
                  matched: matched
                });

              case 12:
                if (!(gas > 0)) {
                  _context22.next = 16;
                  break;
                }

                return _context22.abrupt("return", gas + transferGasCost);

              case 16:
                return _context22.abrupt("return", gas);

              case 17:
              case "end":
                return _context22.stop();
            }
          }
        }, _callee22, null, [[1, 7]]);
      }));

      function estimateGasLimit(_x27) {
        return _estimateGasLimit.apply(this, arguments);
      }

      return estimateGasLimit;
    }()
  }, {
    key: "renew",
    value: function () {
      var _renew = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee23(label, duration) {
        var permanentRegistrarControllerWithoutSigner, signer, permanentRegistrarController, price, priceWithBuffer, gasLimit;
        return _regenerator["default"].wrap(function _callee23$(_context23) {
          while (1) {
            switch (_context23.prev = _context23.next) {
              case 0:
                permanentRegistrarControllerWithoutSigner = this.permanentRegistrarController;
                _context23.next = 3;
                return (0, _web2.getSigner)();

              case 3:
                signer = _context23.sent;
                permanentRegistrarController = permanentRegistrarControllerWithoutSigner.connect(signer);
                _context23.next = 7;
                return this.getRentPrice(label, duration);

              case 7:
                price = _context23.sent;
                priceWithBuffer = getBufferedPrice(price);
                _context23.next = 11;
                return this.estimateGasLimit(function () {
                  return permanentRegistrarController.estimateGas.renew(label, duration, {
                    value: priceWithBuffer
                  });
                });

              case 11:
                gasLimit = _context23.sent;
                return _context23.abrupt("return", permanentRegistrarController.renew(label, duration, {
                  value: priceWithBuffer,
                  gasLimit: gasLimit
                }));

              case 13:
              case "end":
                return _context23.stop();
            }
          }
        }, _callee23, this);
      }));

      function renew(_x28, _x29) {
        return _renew.apply(this, arguments);
      }

      return renew;
    }()
  }, {
    key: "renewAll",
    value: function () {
      var _renewAll = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee24(labels, duration) {
        var bulkRenewalWithoutSigner, signer, bulkRenewal, prices, pricesWithBuffer, gasLimit;
        return _regenerator["default"].wrap(function _callee24$(_context24) {
          while (1) {
            switch (_context24.prev = _context24.next) {
              case 0:
                bulkRenewalWithoutSigner = this.bulkRenewal;
                _context24.next = 3;
                return (0, _web2.getSigner)();

              case 3:
                signer = _context24.sent;
                bulkRenewal = bulkRenewalWithoutSigner.connect(signer);
                _context24.next = 7;
                return this.getRentPrices(labels, duration);

              case 7:
                prices = _context24.sent;
                pricesWithBuffer = getBufferedPrice(prices);
                _context24.next = 11;
                return this.estimateGasLimit(function () {
                  return bulkRenewal.estimateGas.renewAll(labels, duration, {
                    value: pricesWithBuffer
                  });
                });

              case 11:
                gasLimit = _context24.sent;
                return _context24.abrupt("return", bulkRenewal.renewAll(labels, duration, {
                  value: pricesWithBuffer,
                  gasLimit: gasLimit
                }));

              case 13:
              case "end":
                return _context24.stop();
            }
          }
        }, _callee24, this);
      }));

      function renewAll(_x30, _x31) {
        return _renewAll.apply(this, arguments);
      }

      return renewAll;
    }()
  }, {
    key: "releaseDeed",
    value: function () {
      var _releaseDeed = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee25(label) {
        var legacyAuctionRegistrar, signer, legacyAuctionRegistrarWithSigner, hash;
        return _regenerator["default"].wrap(function _callee25$(_context25) {
          while (1) {
            switch (_context25.prev = _context25.next) {
              case 0:
                legacyAuctionRegistrar = this.legacyAuctionRegistrar;
                _context25.next = 3;
                return (0, _web2.getSigner)();

              case 3:
                signer = _context25.sent;
                legacyAuctionRegistrarWithSigner = legacyAuctionRegistrar.connect(signer);
                hash = (0, _labelhash.labelhash)(label);
                return _context25.abrupt("return", legacyAuctionRegistrarWithSigner.releaseDeed(hash));

              case 7:
              case "end":
                return _context25.stop();
            }
          }
        }, _callee25, this);
      }));

      function releaseDeed(_x32) {
        return _releaseDeed.apply(this, arguments);
      }

      return releaseDeed;
    }()
  }, {
    key: "isDNSRegistrar",
    value: function () {
      var _isDNSRegistrar = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee26(parentOwner) {
        var provider, registrar, isDNSSECSupported, isOld, isNew;
        return _regenerator["default"].wrap(function _callee26$(_context26) {
          while (1) {
            switch (_context26.prev = _context26.next) {
              case 0:
                _context26.next = 2;
                return (0, _web2.getProvider)();

              case 2:
                provider = _context26.sent;
                _context26.next = 5;
                return (0, _contracts.getDnsRegistrarContract)({
                  parentOwner: parentOwner,
                  provider: provider
                });

              case 5:
                registrar = _context26.sent;
                isDNSSECSupported = false, isOld = false, isNew = false;
                _context26.prev = 7;
                _context26.next = 10;
                return registrar['supportsInterface(bytes4)'](dnssecClaimOldId);

              case 10:
                isOld = _context26.sent;
                _context26.next = 13;
                return registrar['supportsInterface(bytes4)'](dnssecClaimNewId);

              case 13:
                isNew = _context26.sent;
                _context26.next = 19;
                break;

              case 16:
                _context26.prev = 16;
                _context26.t0 = _context26["catch"](7);
                console.log({
                  e: _context26.t0
                });

              case 19:
                isDNSSECSupported = isOld || isNew;
                return _context26.abrupt("return", isDNSSECSupported);

              case 21:
              case "end":
                return _context26.stop();
            }
          }
        }, _callee26, null, [[7, 16]]);
      }));

      function isDNSRegistrar(_x33) {
        return _isDNSRegistrar.apply(this, arguments);
      }

      return isDNSRegistrar;
    }()
  }, {
    key: "selectDnsRegistrarContract",
    value: function () {
      var _selectDnsRegistrarContract = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee27(_ref3) {
        var parentOwner, provider, registrarContract, isOld, isNew;
        return _regenerator["default"].wrap(function _callee27$(_context27) {
          while (1) {
            switch (_context27.prev = _context27.next) {
              case 0:
                parentOwner = _ref3.parentOwner, provider = _ref3.provider;
                _context27.next = 3;
                return (0, _contracts.getOldDnsRegistrarContract)({
                  parentOwner: parentOwner,
                  provider: provider
                });

              case 3:
                registrarContract = _context27.sent;
                isOld = false, isNew = false;
                _context27.prev = 5;
                _context27.next = 8;
                return registrarContract['supportsInterface(bytes4)'](dnssecClaimOldId);

              case 8:
                isOld = _context27.sent;

                if (isOld) {
                  _context27.next = 16;
                  break;
                }

                _context27.next = 12;
                return (0, _contracts.getDnsRegistrarContract)({
                  parentOwner: parentOwner,
                  provider: provider
                });

              case 12:
                registrarContract = _context27.sent;
                _context27.next = 15;
                return registrarContract['supportsInterface(bytes4)'](dnssecClaimNewId);

              case 15:
                isNew = _context27.sent;

              case 16:
                _context27.next = 21;
                break;

              case 18:
                _context27.prev = 18;
                _context27.t0 = _context27["catch"](5);
                console.log({
                  e: _context27.t0
                });

              case 21:
                return _context27.abrupt("return", {
                  registrarContract: registrarContract,
                  isOld: isOld
                });

              case 22:
              case "end":
                return _context27.stop();
            }
          }
        }, _callee27, null, [[5, 18]]);
      }));

      function selectDnsRegistrarContract(_x34) {
        return _selectDnsRegistrarContract.apply(this, arguments);
      }

      return selectDnsRegistrarContract;
    }()
  }, {
    key: "getDNSEntry",
    value: function () {
      var _getDNSEntry = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee28(name, parentOwner, owner) {
        var dnsRegistrar, provider, _yield$this$selectDns, isOld, registrarContract, oracleAddress, registrarjs, claim, result;

        return _regenerator["default"].wrap(function _callee28$(_context28) {
          while (1) {
            switch (_context28.prev = _context28.next) {
              case 0:
                // Do not cache as it needs to be refetched on "Refresh"
                dnsRegistrar = {
                  stateError: null
                };
                _context28.next = 3;
                return (0, _web2.getProvider)();

              case 3:
                provider = _context28.sent;
                _context28.next = 6;
                return this.selectDnsRegistrarContract({
                  parentOwner: parentOwner,
                  provider: provider
                });

              case 6:
                _yield$this$selectDns = _context28.sent;
                isOld = _yield$this$selectDns.isOld;
                registrarContract = _yield$this$selectDns.registrarContract;
                _context28.next = 11;
                return registrarContract.oracle();

              case 11:
                oracleAddress = _context28.sent;
                registrarjs = new _dnsregistrar["default"](oracleAddress, isOld);
                _context28.prev = 13;
                _context28.next = 16;
                return registrarjs.claim(name);

              case 16:
                claim = _context28.sent;
                result = claim.getResult();
                dnsRegistrar.claim = claim;
                dnsRegistrar.result = result;

                if (!(claim && claim.isFound)) {
                  _context28.next = 25;
                  break;
                }

                dnsRegistrar.dnsOwner = claim.getOwner();

                if (!dnsRegistrar.dnsOwner || parseInt(dnsRegistrar.dnsOwner) === 0) {
                  // Empty
                  dnsRegistrar.state = 8;
                } else if (!_ethers.utils.isAddress(dnsRegistrar.dnsOwner)) {
                  // Invalid record
                  dnsRegistrar.state = 4;
                } else if (!owner || dnsRegistrar.dnsOwner.toLowerCase() === owner.toLowerCase()) {
                  // Ready to register
                  dnsRegistrar.state = 5;
                } else {
                  // Out of sync
                  dnsRegistrar.state = 6;
                }

                _context28.next = 38;
                break;

              case 25:
                if (!(claim && claim.nsec)) {
                  _context28.next = 37;
                  break;
                }

                if (!(result.results.length === 4)) {
                  _context28.next = 30;
                  break;
                }

                // DNS entry does not exist
                dnsRegistrar.state = 1;
                _context28.next = 35;
                break;

              case 30:
                if (!(result.results.length === 6)) {
                  _context28.next = 34;
                  break;
                }

                // DNS entry exists but _ens subdomain does not exist
                dnsRegistrar.state = 3;
                _context28.next = 35;
                break;

              case 34:
                throw "DNSSEC results cannot be ".concat(result.results.length);

              case 35:
                _context28.next = 38;
                break;

              case 37:
                // DNSSEC is not enabled
                dnsRegistrar.state = 2;

              case 38:
                _context28.next = 45;
                break;

              case 40:
                _context28.prev = 40;
                _context28.t0 = _context28["catch"](13);
                console.log('Problem fetching data from DNS', _context28.t0); // Problem fetching data from DNS

                dnsRegistrar.stateError = _context28.t0.message;
                dnsRegistrar.state = 0;

              case 45:
                return _context28.abrupt("return", dnsRegistrar);

              case 46:
              case "end":
                return _context28.stop();
            }
          }
        }, _callee28, this, [[13, 40]]);
      }));

      function getDNSEntry(_x35, _x36, _x37) {
        return _getDNSEntry.apply(this, arguments);
      }

      return getDNSEntry;
    }()
  }, {
    key: "submitProof",
    value: function () {
      var _submitProof = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee29(name, parentOwner) {
        var provider, _yield$this$getDNSEnt, claim, result, owner, _yield$this$selectDns2, registrarWithoutSigner, isOld, signer, user, registrar, proofData, data, proof, resolverAddress;

        return _regenerator["default"].wrap(function _callee29$(_context29) {
          while (1) {
            switch (_context29.prev = _context29.next) {
              case 0:
                _context29.next = 2;
                return (0, _web2.getProvider)();

              case 2:
                provider = _context29.sent;
                _context29.next = 5;
                return this.getDNSEntry(name, parentOwner);

              case 5:
                _yield$this$getDNSEnt = _context29.sent;
                claim = _yield$this$getDNSEnt.claim;
                result = _yield$this$getDNSEnt.result;
                owner = claim.getOwner();
                _context29.next = 11;
                return this.selectDnsRegistrarContract({
                  parentOwner: parentOwner,
                  provider: provider
                });

              case 11:
                _yield$this$selectDns2 = _context29.sent;
                registrarWithoutSigner = _yield$this$selectDns2.registrarContract;
                isOld = _yield$this$selectDns2.isOld;
                _context29.next = 16;
                return (0, _web2.getSigner)();

              case 16:
                signer = _context29.sent;
                _context29.next = 19;
                return signer.getAddress();

              case 19:
                user = _context29.sent;
                registrar = registrarWithoutSigner.connect(signer);
                _context29.next = 23;
                return claim.getProofData();

              case 23:
                proofData = _context29.sent;
                data = isOld ? proofData.data : proofData.rrsets.map(function (x) {
                  return Object.values(x);
                });
                proof = proofData.proof;

                if (!(data.length === 0)) {
                  _context29.next = 30;
                  break;
                }

                return _context29.abrupt("return", registrar.claim(claim.encodedName, proof));

              case 30:
                if (!(!isOld && owner === user)) {
                  _context29.next = 37;
                  break;
                }

                _context29.next = 33;
                return this.getAddress('resolver.arb');

              case 33:
                resolverAddress = _context29.sent;
                return _context29.abrupt("return", registrar.proveAndClaimWithResolver(claim.encodedName, data, proof, resolverAddress, owner));

              case 37:
                return _context29.abrupt("return", registrar.proveAndClaim(claim.encodedName, data, proof));

              case 38:
              case "end":
                return _context29.stop();
            }
          }
        }, _callee29, this);
      }));

      function submitProof(_x38, _x39) {
        return _submitProof.apply(this, arguments);
      }

      return submitProof;
    }()
  }, {
    key: "registerTestdomain",
    value: function () {
      var _registerTestdomain = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee30(label) {
        var provider, testAddress, registrarWithoutSigner, signer, hash, account, registrar;
        return _regenerator["default"].wrap(function _callee30$(_context30) {
          while (1) {
            switch (_context30.prev = _context30.next) {
              case 0:
                _context30.next = 2;
                return (0, _web2.getProvider)();

              case 2:
                provider = _context30.sent;
                _context30.next = 5;
                return this.ENS.owner((0, _namehash.namehash)('test'));

              case 5:
                testAddress = _context30.sent;
                registrarWithoutSigner = (0, _contracts.getTestRegistrarContract)({
                  address: testAddress,
                  provider: provider
                });
                _context30.next = 9;
                return (0, _web2.getSigner)();

              case 9:
                signer = _context30.sent;
                hash = (0, _labelhash.labelhash)(label);
                _context30.next = 13;
                return (0, _web2.getAccount)();

              case 13:
                account = _context30.sent;
                registrar = registrarWithoutSigner.connect(signer);
                return _context30.abrupt("return", registrar.register(hash, account));

              case 16:
              case "end":
                return _context30.stop();
            }
          }
        }, _callee30, this);
      }));

      function registerTestdomain(_x40) {
        return _registerTestdomain.apply(this, arguments);
      }

      return registerTestdomain;
    }()
  }, {
    key: "expiryTimes",
    value: function () {
      var _expiryTimes = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee31(label) {
        var provider, testAddress, TestRegistrar, hash, result;
        return _regenerator["default"].wrap(function _callee31$(_context31) {
          while (1) {
            switch (_context31.prev = _context31.next) {
              case 0:
                _context31.next = 2;
                return (0, _web2.getProvider)();

              case 2:
                provider = _context31.sent;
                _context31.next = 5;
                return this.ENS.owner((0, _namehash.namehash)('test'));

              case 5:
                testAddress = _context31.sent;
                _context31.next = 8;
                return (0, _contracts.getTestRegistrarContract)({
                  address: testAddress,
                  provider: provider
                });

              case 8:
                TestRegistrar = _context31.sent;
                hash = (0, _labelhash.labelhash)(label);
                _context31.next = 12;
                return TestRegistrar.expiryTimes(hash);

              case 12:
                result = _context31.sent;

                if (!(result > 0)) {
                  _context31.next = 15;
                  break;
                }

                return _context31.abrupt("return", new Date(result * 1000));

              case 15:
              case "end":
                return _context31.stop();
            }
          }
        }, _callee31, this);
      }));

      function expiryTimes(_x41) {
        return _expiryTimes.apply(this, arguments);
      }

      return expiryTimes;
    }()
  }]);
  return Registrar;
}();

exports["default"] = Registrar;

function getEthResolver(_x42) {
  return _getEthResolver.apply(this, arguments);
}

function _getEthResolver() {
  _getEthResolver = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee32(ENS) {
    var provider;
    return _regenerator["default"].wrap(function _callee32$(_context32) {
      while (1) {
        switch (_context32.prev = _context32.next) {
          case 0:
            _context32.next = 2;
            return (0, _web2.getProvider)();

          case 2:
            provider = _context32.sent;
            return _context32.abrupt("return", (0, _contracts.getResolverContract)({
              address: _addresses.RESOLVER_ADDRESS,
              provider: provider
            }));

          case 4:
          case "end":
            return _context32.stop();
        }
      }
    }, _callee32);
  }));
  return _getEthResolver.apply(this, arguments);
}

function setupRegistrar(_x43) {
  return _setupRegistrar.apply(this, arguments);
}

function _setupRegistrar() {
  _setupRegistrar = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee33(registryAddress) {
    var provider, ENS, Resolver, ethAddress, controllerAddress, legacyAuctionRegistrarAddress, bulkRenewalAddress;
    return _regenerator["default"].wrap(function _callee33$(_context33) {
      while (1) {
        switch (_context33.prev = _context33.next) {
          case 0:
            _context33.next = 2;
            return (0, _web2.getProvider)();

          case 2:
            provider = _context33.sent;
            ENS = (0, _contracts.getENSContract)({
              address: registryAddress,
              provider: provider
            });
            _context33.next = 6;
            return getEthResolver(ENS);

          case 6:
            Resolver = _context33.sent;
            _context33.next = 9;
            return ENS.owner((0, _namehash.namehash)('arb'));

          case 9:
            ethAddress = _context33.sent;
            _context33.next = 12;
            return Resolver.interfaceImplementer((0, _namehash.namehash)('arb'), permanentRegistrarInterfaceId);

          case 12:
            controllerAddress = _context33.sent;
            _context33.next = 15;
            return Resolver.interfaceImplementer((0, _namehash.namehash)('arb'), legacyRegistrarInterfaceId);

          case 15:
            legacyAuctionRegistrarAddress = _context33.sent;
            _context33.next = 18;
            return Resolver.interfaceImplementer((0, _namehash.namehash)('arb'), bulkRenewalInterfaceId);

          case 18:
            bulkRenewalAddress = _context33.sent;
            return _context33.abrupt("return", new Registrar({
              registryAddress: registryAddress,
              legacyAuctionRegistrarAddress: legacyAuctionRegistrarAddress,
              ethAddress: ethAddress,
              controllerAddress: controllerAddress !== _ethers.constants.AddressZero ? controllerAddress : _addresses.REGISTRAR_CONTROLLER_ADDRESS,
              // fallback
              bulkRenewalAddress: bulkRenewalAddress,
              provider: provider
            }));

          case 20:
          case "end":
            return _context33.stop();
        }
      }
    }, _callee33);
  }));
  return _setupRegistrar.apply(this, arguments);
}