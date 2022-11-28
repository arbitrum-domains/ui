"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setupWeb3 = setupWeb3;
exports.getWeb3 = getWeb3;
exports.getWeb3Read = getWeb3Read;
exports.isReadOnly = isReadOnly;
exports.getNetworkProviderUrl = getNetworkProviderUrl;
exports.getProvider = getProvider;
exports.getSigner = getSigner;
exports.getAccount = getAccount;
exports.getAccounts = getAccounts;
exports.getNetworkId = getNetworkId;
exports.getNetwork = getNetwork;
exports.getBlock = getBlock;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _iframeProvider = require("@ethvault/iframe-provider");

var _ethers = require("ethers");

var _addresses = require("./constants/addresses");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var provider;
var signer;
var readOnly = false;
var requested = false;
var address;

function getDefaultProvider() {
  var providerUrl = getNetworkProviderUrl('421613');
  return new _ethers.ethers.providers.JsonRpcProvider(providerUrl, {
    chainId: 421613,
    name: 'arbitrum-goerli',
    ensAddress: _addresses.REGISTRY_ADDRESS
  });
}

function getJsonRpcProvider(providerOrUrl, networkConfig) {
  return new _ethers.ethers.providers.JsonRpcProvider(providerOrUrl, networkConfig);
}

function getWeb3Provider(providerOrUrl, networkConfig) {
  return new _ethers.ethers.providers.Web3Provider(providerOrUrl, networkConfig);
}

function setupWeb3(_x) {
  return _setupWeb.apply(this, arguments);
}

function _setupWeb() {
  _setupWeb = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(_ref) {
    var networkConfig, customProvider, _ref$reloadOnAccounts, reloadOnAccountsChange, _ref$enforceReadOnly, enforceReadOnly, _ref$enforceReload, enforceReload, ensAddress, iframeProvider, id, url;

    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            networkConfig = _ref.networkConfig, customProvider = _ref.customProvider, _ref$reloadOnAccounts = _ref.reloadOnAccountsChange, reloadOnAccountsChange = _ref$reloadOnAccounts === void 0 ? false : _ref$reloadOnAccounts, _ref$enforceReadOnly = _ref.enforceReadOnly, enforceReadOnly = _ref$enforceReadOnly === void 0 ? false : _ref$enforceReadOnly, _ref$enforceReload = _ref.enforceReload, enforceReload = _ref$enforceReload === void 0 ? false : _ref$enforceReload, ensAddress = _ref.ensAddress;

            if (!ensAddress) {
              ensAddress = _addresses.REGISTRY_ADDRESS; // fallback
            }

            if (!(enforceReadOnly && !customProvider)) {
              _context2.next = 7;
              break;
            }

            readOnly = true;
            address = null;
            provider = getDefaultProvider();
            return _context2.abrupt("return", {
              provider: provider,
              signer: undefined
            });

          case 7:
            if (customProvider) {
              _context2.next = 9;
              break;
            }

            throw new Error('Provider required to setup web3');

          case 9:
            if (enforceReload) {
              provider = null;
              readOnly = false;
              address = null;
            }

            if (!provider) {
              _context2.next = 12;
              break;
            }

            return _context2.abrupt("return", {
              provider: provider,
              signer: signer
            });

          case 12:
            if (!customProvider) {
              _context2.next = 15;
              break;
            }

            if (typeof customProvider === 'string') {
              // handle raw RPC endpoint URL
              if (customProvider.match(/localhost/) && ensAddress) {
                provider = getJsonRpcProvider(customProvider, {
                  chainId: 1337,
                  name: 'unknown',
                  ensAddress: ensAddress
                });
              } else {
                provider = getJsonRpcProvider(customProvider, networkConfig ? _objectSpread(_objectSpread({}, networkConfig), {}, {
                  ensAddress: ensAddress
                }) : {
                  chainId: 421613,
                  name: 'arbitrum-goerli',
                  ensAddress: ensAddress
                });
              }

              signer = provider.getSigner();
            } else {
              // handle EIP 1193 provider
              provider = getWeb3Provider(customProvider, networkConfig ? _objectSpread(_objectSpread({}, networkConfig), {}, {
                ensAddress: ensAddress
              }) : {
                chainId: 421613,
                name: 'arbitrum-goerli',
                ensAddress: ensAddress
              });
            }

            return _context2.abrupt("return", {
              provider: provider,
              signer: signer
            });

          case 15:
            if (!(window && window.parent && window.self && window.self !== window.parent)) {
              _context2.next = 27;
              break;
            }

            _context2.prev = 16;
            iframeProvider = new _iframeProvider.IFrameEthereumProvider({
              targetOrigin: 'https://myethvault.com'
            });
            _context2.next = 20;
            return Promise.race([iframeProvider.enable(), // Race the enable with a promise that rejects after 1 second
            new Promise(function (_, reject) {
              return setTimeout(function () {
                return reject(new Error('Timed out after 1 second'));
              }, 1000);
            })]);

          case 20:
            window.web3 = iframeProvider;
            window.ethereum = iframeProvider;
            _context2.next = 27;
            break;

          case 24:
            _context2.prev = 24;
            _context2.t0 = _context2["catch"](16);
            console.error('Failed to create and enable iframe provider', _context2.t0);

          case 27:
            if (!(window && window.ethereum)) {
              _context2.next = 38;
              break;
            }

            provider = getWeb3Provider(window.ethereum);
            signer = provider.getSigner();

            if (!(window.ethereum.on && reloadOnAccountsChange)) {
              _context2.next = 35;
              break;
            }

            _context2.next = 33;
            return signer.getAddress();

          case 33:
            address = _context2.sent;
            window.ethereum.on('accountsChanged', /*#__PURE__*/function () {
              var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(accounts) {
                return _regenerator["default"].wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        _context.next = 2;
                        return signer.getAddress();

                      case 2:
                        address = _context.sent;

                        if (accounts[0] !== address) {
                          window.location.reload();
                        }

                      case 4:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _callee);
              }));

              return function (_x2) {
                return _ref2.apply(this, arguments);
              };
            }());

          case 35:
            return _context2.abrupt("return", {
              provider: provider,
              signer: signer
            });

          case 38:
            if (!(window.web3 && window.web3.currentProvider)) {
              _context2.next = 47;
              break;
            }

            provider = getWeb3Provider(window.web3.currentProvider);
            _context2.next = 42;
            return provider.getNetwork();

          case 42:
            id = _context2.sent.chainId;
            signer = provider.getSigner();
            return _context2.abrupt("return", {
              provider: provider,
              signer: signer
            });

          case 47:
            _context2.prev = 47;
            url = 'http://localhost:8545';
            _context2.next = 51;
            return fetch(url);

          case 51:
            console.log('local node active');
            provider = getJsonRpcProvider(url);
            _context2.next = 65;
            break;

          case 55:
            _context2.prev = 55;
            _context2.t1 = _context2["catch"](47);

            if (!(_context2.t1.readyState === 4 && (_context2.t1.status === 400 || _context2.t1.status === 200))) {
              _context2.next = 61;
              break;
            }

            // the endpoint is active
            console.log('Success');
            _context2.next = 65;
            break;

          case 61:
            console.log('No web3 instance injected. Falling back to cloud provider.');
            readOnly = true;
            provider = getDefaultProvider();
            return _context2.abrupt("return", {
              provider: provider,
              signer: signer
            });

          case 65:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[16, 24], [47, 55]]);
  }));
  return _setupWeb.apply(this, arguments);
}

function getWeb3() {
  return _getWeb.apply(this, arguments);
}

function _getWeb() {
  _getWeb = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3() {
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            if (provider) {
              _context3.next = 2;
              break;
            }

            throw new Error('Ethers has not been instantiated, please call setupWeb3() first');

          case 2:
            return _context3.abrupt("return", provider);

          case 3:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));
  return _getWeb.apply(this, arguments);
}

function getWeb3Read() {
  return _getWeb3Read.apply(this, arguments);
}

function _getWeb3Read() {
  _getWeb3Read = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4() {
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            if (provider) {
              _context4.next = 2;
              break;
            }

            throw new Error('Ethers has not been instantiated, please call setupWeb3() first');

          case 2:
            return _context4.abrupt("return", provider);

          case 3:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));
  return _getWeb3Read.apply(this, arguments);
}

function isReadOnly() {
  return readOnly;
}

function getNetworkProviderUrl(id) {
  switch (id) {
    case '421613':
      return "https://goerli-rollup.arbitrum.io/rpc";

    case '42161':
      return "https://rpc.ankr.com/arbitrum";

    default:
      return "https://goerli-rollup.arbitrum.io/rpc";
  }
}

function getProvider() {
  return _getProvider.apply(this, arguments);
}

function _getProvider() {
  _getProvider = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5() {
    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            return _context5.abrupt("return", getWeb3());

          case 1:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5);
  }));
  return _getProvider.apply(this, arguments);
}

function getSigner() {
  return _getSigner.apply(this, arguments);
}

function _getSigner() {
  _getSigner = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6() {
    var provider, _signer, _signer2;

    return _regenerator["default"].wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _context6.next = 2;
            return getWeb3();

          case 2:
            provider = _context6.sent;
            _context6.prev = 3;
            _signer = provider.getSigner();
            _context6.next = 7;
            return _signer.getAddress();

          case 7:
            return _context6.abrupt("return", _signer);

          case 10:
            _context6.prev = 10;
            _context6.t0 = _context6["catch"](3);

            if (!window.ethereum) {
              _context6.next = 32;
              break;
            }

            _context6.prev = 13;

            if (!(requested === true)) {
              _context6.next = 16;
              break;
            }

            return _context6.abrupt("return", provider);

          case 16:
            _context6.next = 18;
            return window.ethereum.enable();

          case 18:
            _context6.next = 20;
            return provider.getSigner();

          case 20:
            _signer2 = _context6.sent;
            _context6.next = 23;
            return _signer2.getAddress();

          case 23:
            return _context6.abrupt("return", _signer2);

          case 26:
            _context6.prev = 26;
            _context6.t1 = _context6["catch"](13);
            requested = true;
            return _context6.abrupt("return", provider);

          case 30:
            _context6.next = 33;
            break;

          case 32:
            return _context6.abrupt("return", provider);

          case 33:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6, null, [[3, 10], [13, 26]]);
  }));
  return _getSigner.apply(this, arguments);
}

function getAccount() {
  return _getAccount.apply(this, arguments);
}

function _getAccount() {
  _getAccount = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7() {
    var provider, _signer3, _address;

    return _regenerator["default"].wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            _context7.next = 2;
            return getWeb3();

          case 2:
            provider = _context7.sent;
            _context7.prev = 3;
            _context7.next = 6;
            return provider.getSigner();

          case 6:
            _signer3 = _context7.sent;
            _context7.next = 9;
            return _signer3.getAddress();

          case 9:
            _address = _context7.sent;
            return _context7.abrupt("return", _address);

          case 13:
            _context7.prev = 13;
            _context7.t0 = _context7["catch"](3);
            return _context7.abrupt("return", '0x0');

          case 16:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7, null, [[3, 13]]);
  }));
  return _getAccount.apply(this, arguments);
}

function getAccounts() {
  return _getAccounts.apply(this, arguments);
}

function _getAccounts() {
  _getAccounts = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee8() {
    var account, accounts;
    return _regenerator["default"].wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            _context8.prev = 0;
            _context8.next = 3;
            return getAccount();

          case 3:
            account = _context8.sent;

            if (!(parseInt(account, 16) !== 0)) {
              _context8.next = 8;
              break;
            }

            return _context8.abrupt("return", [account]);

          case 8:
            if (!window.ethereum) {
              _context8.next = 22;
              break;
            }

            _context8.prev = 9;
            _context8.next = 12;
            return window.ethereum.enable();

          case 12:
            accounts = _context8.sent;
            return _context8.abrupt("return", accounts);

          case 16:
            _context8.prev = 16;
            _context8.t0 = _context8["catch"](9);
            console.warn('Did not allow app to access dapp browser');
            throw _context8.t0;

          case 20:
            _context8.next = 23;
            break;

          case 22:
            return _context8.abrupt("return", []);

          case 23:
            _context8.next = 28;
            break;

          case 25:
            _context8.prev = 25;
            _context8.t1 = _context8["catch"](0);
            return _context8.abrupt("return", []);

          case 28:
          case "end":
            return _context8.stop();
        }
      }
    }, _callee8, null, [[0, 25], [9, 16]]);
  }));
  return _getAccounts.apply(this, arguments);
}

function getNetworkId() {
  return _getNetworkId.apply(this, arguments);
}

function _getNetworkId() {
  _getNetworkId = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee9() {
    var provider, network;
    return _regenerator["default"].wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            _context9.next = 2;
            return getWeb3();

          case 2:
            provider = _context9.sent;
            _context9.next = 5;
            return provider.getNetwork();

          case 5:
            network = _context9.sent;
            return _context9.abrupt("return", network.chainId);

          case 7:
          case "end":
            return _context9.stop();
        }
      }
    }, _callee9);
  }));
  return _getNetworkId.apply(this, arguments);
}

function getNetwork() {
  return _getNetwork.apply(this, arguments);
}

function _getNetwork() {
  _getNetwork = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee10() {
    var provider, network;
    return _regenerator["default"].wrap(function _callee10$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            _context10.next = 2;
            return getWeb3();

          case 2:
            provider = _context10.sent;
            _context10.next = 5;
            return provider.getNetwork();

          case 5:
            network = _context10.sent;
            return _context10.abrupt("return", network);

          case 7:
          case "end":
            return _context10.stop();
        }
      }
    }, _callee10);
  }));
  return _getNetwork.apply(this, arguments);
}

function getBlock() {
  return _getBlock.apply(this, arguments);
}

function _getBlock() {
  _getBlock = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee11() {
    var number,
        _provider,
        blockDetails,
        _args11 = arguments;

    return _regenerator["default"].wrap(function _callee11$(_context11) {
      while (1) {
        switch (_context11.prev = _context11.next) {
          case 0:
            number = _args11.length > 0 && _args11[0] !== undefined ? _args11[0] : 'latest';
            _context11.prev = 1;
            _context11.next = 4;
            return getWeb3();

          case 4:
            _provider = _context11.sent;
            _context11.next = 7;
            return _provider.getBlock(number);

          case 7:
            blockDetails = _context11.sent;
            return _context11.abrupt("return", {
              number: blockDetails.number,
              timestamp: blockDetails.timestamp
            });

          case 11:
            _context11.prev = 11;
            _context11.t0 = _context11["catch"](1);
            console.log('error getting block details', _context11.t0);
            return _context11.abrupt("return", {
              number: 0,
              timestamp: 0
            });

          case 15:
          case "end":
            return _context11.stop();
        }
      }
    }, _callee11, null, [[1, 11]]);
  }));
  return _getBlock.apply(this, arguments);
}