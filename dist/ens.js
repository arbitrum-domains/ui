"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getNamehash = getNamehash;
exports.ENS = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _addressEncoder = require("@ensdomains/address-encoder");

var _ENS6 = require("@ensdomains/contracts/abis/ens/ENS.json");

var _ethers = require("ethers");

var _contracts = require("./contracts");

var _utils = require("./utils");

var _contents = require("./utils/contents");

var _labelhash = require("./utils/labelhash");

var _web = require("./web3");

var _interfaces = require("./constants/interfaces");

var _addresses = require("./constants/addresses");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

_addressEncoder.formatsByName['ARB'] = _objectSpread(_objectSpread({}, _addressEncoder.formatsByName['ETH']), {}, {
  name: 'ARB'
});
/* Utils */

function getNamehash(name) {
  return (0, _utils.namehash)(name);
}

function getNamehashWithLabelHash(_x, _x2) {
  return _getNamehashWithLabelHash.apply(this, arguments);
}

function _getNamehashWithLabelHash() {
  _getNamehashWithLabelHash = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee36(labelHash, nodeHash) {
    var node;
    return _regenerator["default"].wrap(function _callee36$(_context36) {
      while (1) {
        switch (_context36.prev = _context36.next) {
          case 0:
            node = _ethers.utils.keccak256(nodeHash + labelHash.slice(2));
            return _context36.abrupt("return", node.toString());

          case 2:
          case "end":
            return _context36.stop();
        }
      }
    }, _callee36);
  }));
  return _getNamehashWithLabelHash.apply(this, arguments);
}

function getLabelhash(label) {
  return (0, _utils.labelhash)(label);
}

var contracts = {
  42161: {
    registry: ''
  },
  421613: {
    registry: _addresses.REGISTRY_ADDRESS
  }
};

var ENS = /*#__PURE__*/function () {
  function ENS(_ref) {
    var networkId = _ref.networkId,
        registryAddress = _ref.registryAddress,
        provider = _ref.provider;
    (0, _classCallCheck2["default"])(this, ENS);
    this.contracts = contracts;
    var hasRegistry = this.contracts[networkId] && Object.keys(this.contracts[networkId]).includes('registry');

    if (!hasRegistry && !registryAddress) {
      throw new Error("Unsupported network ".concat(networkId));
    } else if (this.contracts[networkId] && !registryAddress) {
      registryAddress = contracts[networkId].registry;
    }

    this.registryAddress = registryAddress;
    var ENSContract = (0, _contracts.getENSContract)({
      address: registryAddress,
      provider: provider
    });
    this.ENS = ENSContract;
  }
  /* Get the raw Ethers contract object */


  (0, _createClass2["default"])(ENS, [{
    key: "getENSContractInstance",
    value: function getENSContractInstance() {
      return this.ENS;
    }
    /* Main methods */
    // TODO: ethers.js does not support owner

  }, {
    key: "getOwner",
    value: function () {
      var _getOwner = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(name) {
        var namehash, owner;
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                namehash = getNamehash(name);
                _context.next = 3;
                return this.ENS.owner(namehash);

              case 3:
                owner = _context.sent;
                return _context.abrupt("return", owner);

              case 5:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function getOwner(_x3) {
        return _getOwner.apply(this, arguments);
      }

      return getOwner;
    }()
  }, {
    key: "getResolver",
    value: function () {
      var _getResolver = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(name) {
        var provider, resolver;
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return (0, _web.getProvider)();

              case 2:
                provider = _context2.sent;
                _context2.next = 5;
                return provider.getResolver(name);

              case 5:
                resolver = _context2.sent;

                if (!resolver) {
                  _context2.next = 8;
                  break;
                }

                return _context2.abrupt("return", resolver.address);

              case 8:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));

      function getResolver(_x4) {
        return _getResolver.apply(this, arguments);
      }

      return getResolver;
    }()
  }, {
    key: "_getResolverObject",
    value: function () {
      var _getResolverObject2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(name) {
        var provider;
        return _regenerator["default"].wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.next = 2;
                return (0, _web.getProvider)();

              case 2:
                provider = _context3.sent;
                return _context3.abrupt("return", provider.getResolver(name));

              case 4:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3);
      }));

      function _getResolverObject(_x5) {
        return _getResolverObject2.apply(this, arguments);
      }

      return _getResolverObject;
    }() // TODO: ethers.js does not support ttl

  }, {
    key: "getTTL",
    value: function () {
      var _getTTL = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(name) {
        var namehash;
        return _regenerator["default"].wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                namehash = getNamehash(name);
                return _context4.abrupt("return", this.ENS.ttl(namehash));

              case 2:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function getTTL(_x6) {
        return _getTTL.apply(this, arguments);
      }

      return getTTL;
    }() // TODO: ethers.js does not support lookup by namehash

  }, {
    key: "getResolverWithLabelhash",
    value: function () {
      var _getResolverWithLabelhash = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(labelhash, nodehash) {
        var namehash;
        return _regenerator["default"].wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                _context5.next = 2;
                return getNamehashWithLabelHash(labelhash, nodehash);

              case 2:
                namehash = _context5.sent;
                return _context5.abrupt("return", this.ENS.resolver(namehash));

              case 4:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      function getResolverWithLabelhash(_x7, _x8) {
        return _getResolverWithLabelhash.apply(this, arguments);
      }

      return getResolverWithLabelhash;
    }() // TODO: ethers.js does not support lookup by namehash

  }, {
    key: "getOwnerWithLabelHash",
    value: function () {
      var _getOwnerWithLabelHash = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(labelhash, nodeHash) {
        var namehash;
        return _regenerator["default"].wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                _context6.next = 2;
                return getNamehashWithLabelHash(labelhash, nodeHash);

              case 2:
                namehash = _context6.sent;
                return _context6.abrupt("return", this.ENS.owner(namehash));

              case 4:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6, this);
      }));

      function getOwnerWithLabelHash(_x9, _x10) {
        return _getOwnerWithLabelHash.apply(this, arguments);
      }

      return getOwnerWithLabelHash;
    }()
  }, {
    key: "getAddress",
    value: function () {
      var _getAddress = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7(name) {
        return _regenerator["default"].wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                if (!(name === 'resolver.arb')) {
                  _context7.next = 2;
                  break;
                }

                return _context7.abrupt("return", _addresses.RESOLVER_ADDRESS);

              case 2:
                return _context7.abrupt("return", this.getAddr(name, 'ARB'));

              case 3:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7, this);
      }));

      function getAddress(_x11) {
        return _getAddress.apply(this, arguments);
      }

      return getAddress;
    }()
  }, {
    key: "getAddr",
    value: function () {
      var _getAddr = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee8(name, key) {
        var resolver, _formatsByName$key, coinType, encoder, encodedCoinType, data, buffer;

        return _regenerator["default"].wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                if (name) {
                  _context8.next = 2;
                  break;
                }

                return _context8.abrupt("return", _utils.emptyAddress);

              case 2:
                _context8.next = 4;
                return this._getResolverObject(name);

              case 4:
                resolver = _context8.sent;

                if (resolver) {
                  _context8.next = 7;
                  break;
                }

                return _context8.abrupt("return", _utils.emptyAddress);

              case 7:
                _context8.prev = 7;
                _formatsByName$key = _addressEncoder.formatsByName[key], coinType = _formatsByName$key.coinType, encoder = _formatsByName$key.encoder;
                encodedCoinType = _ethers.utils.hexZeroPad(_ethers.BigNumber.from(coinType).toHexString(), 32);
                _context8.next = 12;
                return resolver._fetchBytes('0xf1cb7e06', encodedCoinType);

              case 12:
                data = _context8.sent;

                if (![_utils.emptyAddress, '0x', null].includes(data)) {
                  _context8.next = 15;
                  break;
                }

                return _context8.abrupt("return", _utils.emptyAddress);

              case 15:
                buffer = Buffer.from(data.slice(2), "hex");
                return _context8.abrupt("return", encoder(buffer));

              case 19:
                _context8.prev = 19;
                _context8.t0 = _context8["catch"](7);
                console.log(_context8.t0);
                console.warn('Error getting addr on the resolver contract, are you sure the resolver address is a resolver contract?');
                return _context8.abrupt("return", _utils.emptyAddress);

              case 24:
              case "end":
                return _context8.stop();
            }
          }
        }, _callee8, this, [[7, 19]]);
      }));

      function getAddr(_x12, _x13) {
        return _getAddr.apply(this, arguments);
      }

      return getAddr;
    }()
  }, {
    key: "getContent",
    value: function () {
      var _getContent = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee9(name) {
        var resolver, _namehash, provider, Resolver, contentHashSignature, isContentHashSupported, encoded, _decodeContenthash, protocolType, decoded, error, value, message;

        return _regenerator["default"].wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                _context9.next = 2;
                return this._getResolverObject(name);

              case 2:
                resolver = _context9.sent;

                if (resolver) {
                  _context9.next = 5;
                  break;
                }

                return _context9.abrupt("return", _utils.emptyAddress);

              case 5:
                _context9.prev = 5;
                _namehash = getNamehash(name);
                _context9.next = 9;
                return (0, _web.getProvider)();

              case 9:
                provider = _context9.sent;
                Resolver = (0, _contracts.getResolverContract)({
                  address: resolver.address,
                  provider: provider
                });
                contentHashSignature = _ethers.utils.solidityKeccak256(['string'], ['contenthash(bytes32)']).slice(0, 10);
                _context9.next = 14;
                return Resolver.supportsInterface(contentHashSignature);

              case 14:
                isContentHashSupported = _context9.sent;

                if (!isContentHashSupported) {
                  _context9.next = 25;
                  break;
                }

                _context9.next = 18;
                return resolver._fetchBytes('0xbc1c58d1');

              case 18:
                encoded = _context9.sent;
                _decodeContenthash = (0, _contents.decodeContenthash)(encoded), protocolType = _decodeContenthash.protocolType, decoded = _decodeContenthash.decoded, error = _decodeContenthash.error;

                if (!error) {
                  _context9.next = 22;
                  break;
                }

                return _context9.abrupt("return", {
                  value: error,
                  contentType: 'error'
                });

              case 22:
                return _context9.abrupt("return", {
                  value: "".concat(protocolType, "://").concat(decoded),
                  contentType: 'contenthash'
                });

              case 25:
                _context9.next = 27;
                return Resolver.content(_namehash);

              case 27:
                value = _context9.sent;
                return _context9.abrupt("return", {
                  value: value,
                  contentType: 'oldcontent'
                });

              case 29:
                _context9.next = 36;
                break;

              case 31:
                _context9.prev = 31;
                _context9.t0 = _context9["catch"](5);
                message = 'Error getting content on the resolver contract, are you sure the resolver address is a resolver contract?';
                console.warn(message, _context9.t0);
                return _context9.abrupt("return", {
                  value: message,
                  contentType: 'error'
                });

              case 36:
              case "end":
                return _context9.stop();
            }
          }
        }, _callee9, this, [[5, 31]]);
      }));

      function getContent(_x14) {
        return _getContent.apply(this, arguments);
      }

      return getContent;
    }()
  }, {
    key: "getText",
    value: function () {
      var _getText = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee10(name, key) {
        var resolver, addr;
        return _regenerator["default"].wrap(function _callee10$(_context10) {
          while (1) {
            switch (_context10.prev = _context10.next) {
              case 0:
                _context10.next = 2;
                return this._getResolverObject(name);

              case 2:
                resolver = _context10.sent;

                if (resolver) {
                  _context10.next = 5;
                  break;
                }

                return _context10.abrupt("return", '');

              case 5:
                _context10.prev = 5;
                _context10.next = 8;
                return resolver.getText(key);

              case 8:
                addr = _context10.sent;
                return _context10.abrupt("return", addr);

              case 12:
                _context10.prev = 12;
                _context10.t0 = _context10["catch"](5);
                console.warn('Error getting text record on the resolver contract, are you sure the resolver address is a resolver contract?');
                return _context10.abrupt("return", '');

              case 16:
              case "end":
                return _context10.stop();
            }
          }
        }, _callee10, this, [[5, 12]]);
      }));

      function getText(_x15, _x16) {
        return _getText.apply(this, arguments);
      }

      return getText;
    }()
  }, {
    key: "getName",
    value: function () {
      var _getName = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee11(address) {
        var provider, name;
        return _regenerator["default"].wrap(function _callee11$(_context11) {
          while (1) {
            switch (_context11.prev = _context11.next) {
              case 0:
                _context11.next = 2;
                return (0, _web.getProvider)();

              case 2:
                provider = _context11.sent;
                _context11.next = 5;
                return provider.lookupAddress(address);

              case 5:
                name = _context11.sent;
                return _context11.abrupt("return", {
                  name: name
                });

              case 7:
              case "end":
                return _context11.stop();
            }
          }
        }, _callee11);
      }));

      function getName(_x17) {
        return _getName.apply(this, arguments);
      }

      return getName;
    }()
  }, {
    key: "isMigrated",
    value: function () {
      var _isMigrated = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee12(name) {
        var namehash;
        return _regenerator["default"].wrap(function _callee12$(_context12) {
          while (1) {
            switch (_context12.prev = _context12.next) {
              case 0:
                namehash = getNamehash(name);
                return _context12.abrupt("return", this.ENS.recordExists(namehash));

              case 2:
              case "end":
                return _context12.stop();
            }
          }
        }, _callee12, this);
      }));

      function isMigrated(_x18) {
        return _isMigrated.apply(this, arguments);
      }

      return isMigrated;
    }()
  }, {
    key: "getResolverDetails",
    value: function () {
      var _getResolverDetails = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee13(node) {
        var addrPromise, contentPromise, _yield$Promise$all, _yield$Promise$all2, addr, content;

        return _regenerator["default"].wrap(function _callee13$(_context13) {
          while (1) {
            switch (_context13.prev = _context13.next) {
              case 0:
                _context13.prev = 0;
                addrPromise = this.getAddress(node.name);
                contentPromise = this.getContent(node.name);
                _context13.next = 5;
                return Promise.all([addrPromise, contentPromise]);

              case 5:
                _yield$Promise$all = _context13.sent;
                _yield$Promise$all2 = (0, _slicedToArray2["default"])(_yield$Promise$all, 2);
                addr = _yield$Promise$all2[0];
                content = _yield$Promise$all2[1];
                return _context13.abrupt("return", _objectSpread(_objectSpread({}, node), {}, {
                  addr: addr,
                  content: content.value,
                  contentType: content.contentType
                }));

              case 12:
                _context13.prev = 12;
                _context13.t0 = _context13["catch"](0);
                return _context13.abrupt("return", _objectSpread(_objectSpread({}, node), {}, {
                  addr: '0x0',
                  content: '0x0',
                  contentType: 'error'
                }));

              case 15:
              case "end":
                return _context13.stop();
            }
          }
        }, _callee13, this, [[0, 12]]);
      }));

      function getResolverDetails(_x19) {
        return _getResolverDetails.apply(this, arguments);
      }

      return getResolverDetails;
    }()
  }, {
    key: "getSubdomains",
    value: function () {
      var _getSubdomains = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee14(name) {
        var _this = this;

        var startBlock, namehash, rawLogs, flattenedLogs, labelhashes, ownerPromises;
        return _regenerator["default"].wrap(function _callee14$(_context14) {
          while (1) {
            switch (_context14.prev = _context14.next) {
              case 0:
                _context14.next = 2;
                return (0, _utils.getEnsStartBlock)();

              case 2:
                startBlock = _context14.sent;
                namehash = getNamehash(name);
                _context14.next = 6;
                return this.getENSEvent('NewOwner', {
                  topics: [namehash],
                  fromBlock: startBlock
                });

              case 6:
                rawLogs = _context14.sent;
                flattenedLogs = rawLogs.map(function (log) {
                  return log.args.label;
                });
                flattenedLogs.reverse();
                labelhashes = (0, _utils.uniq)(flattenedLogs);
                ownerPromises = labelhashes.map(function (label) {
                  return _this.getOwnerWithLabelHash(label, namehash);
                });
                return _context14.abrupt("return", Promise.all(ownerPromises).then(function (owners) {
                  return owners.map(function (owner, index) {
                    return {
                      label: null,
                      labelhash: labelhashes[index],
                      decrypted: false,
                      node: name,
                      name: "".concat((0, _labelhash.encodeLabelhash)(labelhashes[index]), ".").concat(name),
                      owner: owner
                    };
                  });
                }));

              case 12:
              case "end":
                return _context14.stop();
            }
          }
        }, _callee14, this);
      }));

      function getSubdomains(_x20) {
        return _getSubdomains.apply(this, arguments);
      }

      return getSubdomains;
    }()
  }, {
    key: "getDomainDetails",
    value: function () {
      var _getDomainDetails = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee15(name) {
        var nameArray, labelhash, _yield$Promise$all3, _yield$Promise$all4, owner, resolver, node, hasResolver;

        return _regenerator["default"].wrap(function _callee15$(_context15) {
          while (1) {
            switch (_context15.prev = _context15.next) {
              case 0:
                nameArray = name.split('.');
                labelhash = getLabelhash(nameArray[0]);
                _context15.next = 4;
                return Promise.all([this.getOwner(name), this.getResolver(name)]);

              case 4:
                _yield$Promise$all3 = _context15.sent;
                _yield$Promise$all4 = (0, _slicedToArray2["default"])(_yield$Promise$all3, 2);
                owner = _yield$Promise$all4[0];
                resolver = _yield$Promise$all4[1];
                node = {
                  name: name,
                  label: nameArray[0],
                  labelhash: labelhash,
                  owner: owner,
                  resolver: resolver
                };
                hasResolver = parseInt(node.resolver, 16) !== 0;

                if (!hasResolver) {
                  _context15.next = 12;
                  break;
                }

                return _context15.abrupt("return", this.getResolverDetails(node));

              case 12:
                return _context15.abrupt("return", _objectSpread(_objectSpread({}, node), {}, {
                  addr: null,
                  content: null
                }));

              case 13:
              case "end":
                return _context15.stop();
            }
          }
        }, _callee15, this);
      }));

      function getDomainDetails(_x21) {
        return _getDomainDetails.apply(this, arguments);
      }

      return getDomainDetails;
    }()
    /* non-constant functions */

  }, {
    key: "setOwner",
    value: function () {
      var _setOwner = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee16(name, newOwner) {
        var ENSWithoutSigner, signer, _ENS, namehash;

        return _regenerator["default"].wrap(function _callee16$(_context16) {
          while (1) {
            switch (_context16.prev = _context16.next) {
              case 0:
                ENSWithoutSigner = this.ENS;
                _context16.next = 3;
                return (0, _web.getSigner)();

              case 3:
                signer = _context16.sent;
                _ENS = ENSWithoutSigner.connect(signer);
                namehash = getNamehash(name);
                return _context16.abrupt("return", _ENS.setOwner(namehash, newOwner));

              case 7:
              case "end":
                return _context16.stop();
            }
          }
        }, _callee16, this);
      }));

      function setOwner(_x22, _x23) {
        return _setOwner.apply(this, arguments);
      }

      return setOwner;
    }()
  }, {
    key: "setSubnodeOwner",
    value: function () {
      var _setSubnodeOwner = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee17(name, newOwner) {
        var ENSWithoutSigner, signer, _ENS2, nameArray, label, node, labelhash, parentNamehash;

        return _regenerator["default"].wrap(function _callee17$(_context17) {
          while (1) {
            switch (_context17.prev = _context17.next) {
              case 0:
                ENSWithoutSigner = this.ENS;
                _context17.next = 3;
                return (0, _web.getSigner)();

              case 3:
                signer = _context17.sent;
                _ENS2 = ENSWithoutSigner.connect(signer);
                nameArray = name.split('.');
                label = nameArray[0];
                node = nameArray.slice(1).join('.');
                labelhash = getLabelhash(label);
                parentNamehash = getNamehash(node);
                return _context17.abrupt("return", _ENS2.setSubnodeOwner(parentNamehash, labelhash, newOwner));

              case 11:
              case "end":
                return _context17.stop();
            }
          }
        }, _callee17, this);
      }));

      function setSubnodeOwner(_x24, _x25) {
        return _setSubnodeOwner.apply(this, arguments);
      }

      return setSubnodeOwner;
    }()
  }, {
    key: "setSubnodeRecord",
    value: function () {
      var _setSubnodeRecord = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee18(name, newOwner, resolver) {
        var ENSWithoutSigner, signer, _ENS3, nameArray, label, node, labelhash, parentNamehash, ttl;

        return _regenerator["default"].wrap(function _callee18$(_context18) {
          while (1) {
            switch (_context18.prev = _context18.next) {
              case 0:
                ENSWithoutSigner = this.ENS;
                _context18.next = 3;
                return (0, _web.getSigner)();

              case 3:
                signer = _context18.sent;
                _ENS3 = ENSWithoutSigner.connect(signer);
                nameArray = name.split('.');
                label = nameArray[0];
                node = nameArray.slice(1).join('.');
                labelhash = getLabelhash(label);
                parentNamehash = getNamehash(node);
                _context18.next = 12;
                return this.getTTL(name);

              case 12:
                ttl = _context18.sent;
                return _context18.abrupt("return", _ENS3.setSubnodeRecord(parentNamehash, labelhash, newOwner, resolver, ttl));

              case 14:
              case "end":
                return _context18.stop();
            }
          }
        }, _callee18, this);
      }));

      function setSubnodeRecord(_x26, _x27, _x28) {
        return _setSubnodeRecord.apply(this, arguments);
      }

      return setSubnodeRecord;
    }()
  }, {
    key: "setResolver",
    value: function () {
      var _setResolver = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee19(name, resolver) {
        var namehash, ENSWithoutSigner, signer, _ENS4;

        return _regenerator["default"].wrap(function _callee19$(_context19) {
          while (1) {
            switch (_context19.prev = _context19.next) {
              case 0:
                namehash = getNamehash(name);
                ENSWithoutSigner = this.ENS;
                _context19.next = 4;
                return (0, _web.getSigner)();

              case 4:
                signer = _context19.sent;
                _ENS4 = ENSWithoutSigner.connect(signer);
                return _context19.abrupt("return", _ENS4.setResolver(namehash, resolver));

              case 7:
              case "end":
                return _context19.stop();
            }
          }
        }, _callee19, this);
      }));

      function setResolver(_x29, _x30) {
        return _setResolver.apply(this, arguments);
      }

      return setResolver;
    }()
  }, {
    key: "setAddress",
    value: function () {
      var _setAddress = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee20(name, address) {
        var resolverAddr;
        return _regenerator["default"].wrap(function _callee20$(_context20) {
          while (1) {
            switch (_context20.prev = _context20.next) {
              case 0:
                _context20.next = 2;
                return this.getResolver(name);

              case 2:
                resolverAddr = _context20.sent;
                return _context20.abrupt("return", this.setAddressWithResolver(name, address, resolverAddr));

              case 4:
              case "end":
                return _context20.stop();
            }
          }
        }, _callee20, this);
      }));

      function setAddress(_x31, _x32) {
        return _setAddress.apply(this, arguments);
      }

      return setAddress;
    }()
  }, {
    key: "setAddressWithResolver",
    value: function () {
      var _setAddressWithResolver = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee21(name, address, resolverAddr) {
        var namehash, provider, ResolverWithoutSigner, signer, Resolver;
        return _regenerator["default"].wrap(function _callee21$(_context21) {
          while (1) {
            switch (_context21.prev = _context21.next) {
              case 0:
                namehash = getNamehash(name);
                _context21.next = 3;
                return (0, _web.getProvider)();

              case 3:
                provider = _context21.sent;
                ResolverWithoutSigner = (0, _contracts.getResolverContract)({
                  address: resolverAddr,
                  provider: provider
                });
                _context21.next = 7;
                return (0, _web.getSigner)();

              case 7:
                signer = _context21.sent;
                Resolver = ResolverWithoutSigner.connect(signer);
                return _context21.abrupt("return", Resolver['setAddr(bytes32,address)'](namehash, address));

              case 10:
              case "end":
                return _context21.stop();
            }
          }
        }, _callee21);
      }));

      function setAddressWithResolver(_x33, _x34, _x35) {
        return _setAddressWithResolver.apply(this, arguments);
      }

      return setAddressWithResolver;
    }()
  }, {
    key: "setAddr",
    value: function () {
      var _setAddr = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee22(name, key, address) {
        var resolverAddr;
        return _regenerator["default"].wrap(function _callee22$(_context22) {
          while (1) {
            switch (_context22.prev = _context22.next) {
              case 0:
                _context22.next = 2;
                return this.getResolver(name);

              case 2:
                resolverAddr = _context22.sent;
                return _context22.abrupt("return", this.setAddrWithResolver(name, key, address, resolverAddr));

              case 4:
              case "end":
                return _context22.stop();
            }
          }
        }, _callee22, this);
      }));

      function setAddr(_x36, _x37, _x38) {
        return _setAddr.apply(this, arguments);
      }

      return setAddr;
    }()
  }, {
    key: "setAddrWithResolver",
    value: function () {
      var _setAddrWithResolver = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee23(name, key, address, resolverAddr) {
        var namehash, provider, ResolverWithoutSigner, signer, Resolver, _formatsByName$key2, decoder, coinType, addressAsBytes;

        return _regenerator["default"].wrap(function _callee23$(_context23) {
          while (1) {
            switch (_context23.prev = _context23.next) {
              case 0:
                namehash = getNamehash(name);
                _context23.next = 3;
                return (0, _web.getProvider)();

              case 3:
                provider = _context23.sent;
                ResolverWithoutSigner = (0, _contracts.getResolverContract)({
                  address: resolverAddr,
                  provider: provider
                });
                _context23.next = 7;
                return (0, _web.getSigner)();

              case 7:
                signer = _context23.sent;
                Resolver = ResolverWithoutSigner.connect(signer);
                _formatsByName$key2 = _addressEncoder.formatsByName[key], decoder = _formatsByName$key2.decoder, coinType = _formatsByName$key2.coinType;

                if (!address || address === '') {
                  addressAsBytes = Buffer.from('');
                } else {
                  addressAsBytes = decoder(address);
                }

                return _context23.abrupt("return", Resolver['setAddr(bytes32,uint256,bytes)'](namehash, coinType, addressAsBytes));

              case 12:
              case "end":
                return _context23.stop();
            }
          }
        }, _callee23);
      }));

      function setAddrWithResolver(_x39, _x40, _x41, _x42) {
        return _setAddrWithResolver.apply(this, arguments);
      }

      return setAddrWithResolver;
    }()
  }, {
    key: "setContent",
    value: function () {
      var _setContent = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee24(name, content) {
        var resolverAddr;
        return _regenerator["default"].wrap(function _callee24$(_context24) {
          while (1) {
            switch (_context24.prev = _context24.next) {
              case 0:
                _context24.next = 2;
                return this.getResolver(name);

              case 2:
                resolverAddr = _context24.sent;
                return _context24.abrupt("return", this.setContentWithResolver(name, content, resolverAddr));

              case 4:
              case "end":
                return _context24.stop();
            }
          }
        }, _callee24, this);
      }));

      function setContent(_x43, _x44) {
        return _setContent.apply(this, arguments);
      }

      return setContent;
    }()
  }, {
    key: "setContentWithResolver",
    value: function () {
      var _setContentWithResolver = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee25(name, content, resolverAddr) {
        var namehash, provider, ResolverWithoutSigner, signer, Resolver;
        return _regenerator["default"].wrap(function _callee25$(_context25) {
          while (1) {
            switch (_context25.prev = _context25.next) {
              case 0:
                namehash = getNamehash(name);
                _context25.next = 3;
                return (0, _web.getProvider)();

              case 3:
                provider = _context25.sent;
                ResolverWithoutSigner = (0, _contracts.getResolverContract)({
                  address: resolverAddr,
                  provider: provider
                });
                _context25.next = 7;
                return (0, _web.getSigner)();

              case 7:
                signer = _context25.sent;
                Resolver = ResolverWithoutSigner.connect(signer);
                return _context25.abrupt("return", Resolver.setContent(namehash, content));

              case 10:
              case "end":
                return _context25.stop();
            }
          }
        }, _callee25);
      }));

      function setContentWithResolver(_x45, _x46, _x47) {
        return _setContentWithResolver.apply(this, arguments);
      }

      return setContentWithResolver;
    }()
  }, {
    key: "setContenthash",
    value: function () {
      var _setContenthash = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee26(name, content) {
        var resolverAddr;
        return _regenerator["default"].wrap(function _callee26$(_context26) {
          while (1) {
            switch (_context26.prev = _context26.next) {
              case 0:
                _context26.next = 2;
                return this.getResolver(name);

              case 2:
                resolverAddr = _context26.sent;
                return _context26.abrupt("return", this.setContenthashWithResolver(name, content, resolverAddr));

              case 4:
              case "end":
                return _context26.stop();
            }
          }
        }, _callee26, this);
      }));

      function setContenthash(_x48, _x49) {
        return _setContenthash.apply(this, arguments);
      }

      return setContenthash;
    }()
  }, {
    key: "setContenthashWithResolver",
    value: function () {
      var _setContenthashWithResolver = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee27(name, content, resolverAddr) {
        var encodedContenthash, namehash, provider, ResolverWithoutSigner, signer, Resolver;
        return _regenerator["default"].wrap(function _callee27$(_context27) {
          while (1) {
            switch (_context27.prev = _context27.next) {
              case 0:
                encodedContenthash = content;

                if (parseInt(content, 16) !== 0) {
                  encodedContenthash = (0, _contents.encodeContenthash)(content);
                }

                namehash = getNamehash(name);
                _context27.next = 5;
                return (0, _web.getProvider)();

              case 5:
                provider = _context27.sent;
                ResolverWithoutSigner = (0, _contracts.getResolverContract)({
                  address: resolverAddr,
                  provider: provider
                });
                _context27.next = 9;
                return (0, _web.getSigner)();

              case 9:
                signer = _context27.sent;
                Resolver = ResolverWithoutSigner.connect(signer);
                return _context27.abrupt("return", Resolver.setContenthash(namehash, encodedContenthash.encoded));

              case 12:
              case "end":
                return _context27.stop();
            }
          }
        }, _callee27);
      }));

      function setContenthashWithResolver(_x50, _x51, _x52) {
        return _setContenthashWithResolver.apply(this, arguments);
      }

      return setContenthashWithResolver;
    }()
  }, {
    key: "setText",
    value: function () {
      var _setText = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee28(name, key, recordValue) {
        var resolverAddr;
        return _regenerator["default"].wrap(function _callee28$(_context28) {
          while (1) {
            switch (_context28.prev = _context28.next) {
              case 0:
                _context28.next = 2;
                return this.getResolver(name);

              case 2:
                resolverAddr = _context28.sent;
                return _context28.abrupt("return", this.setTextWithResolver(name, key, recordValue, resolverAddr));

              case 4:
              case "end":
                return _context28.stop();
            }
          }
        }, _callee28, this);
      }));

      function setText(_x53, _x54, _x55) {
        return _setText.apply(this, arguments);
      }

      return setText;
    }()
  }, {
    key: "setTextWithResolver",
    value: function () {
      var _setTextWithResolver = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee29(name, key, recordValue, resolverAddr) {
        var namehash, provider, ResolverWithoutSigner, signer, Resolver;
        return _regenerator["default"].wrap(function _callee29$(_context29) {
          while (1) {
            switch (_context29.prev = _context29.next) {
              case 0:
                namehash = getNamehash(name);
                _context29.next = 3;
                return (0, _web.getProvider)();

              case 3:
                provider = _context29.sent;
                ResolverWithoutSigner = (0, _contracts.getResolverContract)({
                  address: resolverAddr,
                  provider: provider
                });
                _context29.next = 7;
                return (0, _web.getSigner)();

              case 7:
                signer = _context29.sent;
                Resolver = ResolverWithoutSigner.connect(signer);
                return _context29.abrupt("return", Resolver.setText(namehash, key, recordValue));

              case 10:
              case "end":
                return _context29.stop();
            }
          }
        }, _callee29);
      }));

      function setTextWithResolver(_x56, _x57, _x58, _x59) {
        return _setTextWithResolver.apply(this, arguments);
      }

      return setTextWithResolver;
    }()
  }, {
    key: "createSubdomain",
    value: function () {
      var _createSubdomain = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee30(name) {
        var account, publicResolverAddress;
        return _regenerator["default"].wrap(function _callee30$(_context30) {
          while (1) {
            switch (_context30.prev = _context30.next) {
              case 0:
                _context30.next = 2;
                return (0, _web.getAccount)();

              case 2:
                account = _context30.sent;
                _context30.next = 5;
                return this.getAddress('resolver.arb');

              case 5:
                publicResolverAddress = _context30.sent;
                _context30.prev = 6;
                return _context30.abrupt("return", this.setSubnodeRecord(name, account, publicResolverAddress));

              case 10:
                _context30.prev = 10;
                _context30.t0 = _context30["catch"](6);
                console.log('error creating subdomain', _context30.t0);

              case 13:
              case "end":
                return _context30.stop();
            }
          }
        }, _callee30, this, [[6, 10]]);
      }));

      function createSubdomain(_x60) {
        return _createSubdomain.apply(this, arguments);
      }

      return createSubdomain;
    }()
  }, {
    key: "deleteSubdomain",
    value: function () {
      var _deleteSubdomain = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee31(name) {
        return _regenerator["default"].wrap(function _callee31$(_context31) {
          while (1) {
            switch (_context31.prev = _context31.next) {
              case 0:
                _context31.prev = 0;
                return _context31.abrupt("return", this.setSubnodeRecord(name, _utils.emptyAddress, _utils.emptyAddress));

              case 4:
                _context31.prev = 4;
                _context31.t0 = _context31["catch"](0);
                console.log('error deleting subdomain', _context31.t0);

              case 7:
              case "end":
                return _context31.stop();
            }
          }
        }, _callee31, this, [[0, 4]]);
      }));

      function deleteSubdomain(_x61) {
        return _deleteSubdomain.apply(this, arguments);
      }

      return deleteSubdomain;
    }()
  }, {
    key: "claimAndSetReverseRecordName",
    value: function () {
      var _claimAndSetReverseRecordName = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee32(name) {
        var overrides,
            reverseRegistrarAddr,
            provider,
            reverseRegistrarWithoutSigner,
            signer,
            reverseRegistrar,
            networkId,
            gasLimit,
            _args32 = arguments;
        return _regenerator["default"].wrap(function _callee32$(_context32) {
          while (1) {
            switch (_context32.prev = _context32.next) {
              case 0:
                overrides = _args32.length > 1 && _args32[1] !== undefined ? _args32[1] : {};
                _context32.next = 3;
                return this.getOwner('addr.reverse');

              case 3:
                reverseRegistrarAddr = _context32.sent;
                _context32.next = 6;
                return (0, _web.getProvider)();

              case 6:
                provider = _context32.sent;
                reverseRegistrarWithoutSigner = (0, _contracts.getReverseRegistrarContract)({
                  address: reverseRegistrarAddr,
                  provider: provider
                });
                _context32.next = 10;
                return (0, _web.getSigner)();

              case 10:
                signer = _context32.sent;
                reverseRegistrar = reverseRegistrarWithoutSigner.connect(signer);
                _context32.next = 14;
                return (0, _web.getNetworkId)();

              case 14:
                networkId = _context32.sent;

                if (!(parseInt(networkId) > 1000)) {
                  _context32.next = 20;
                  break;
                }

                _context32.next = 18;
                return reverseRegistrar.estimateGas.setName(name);

              case 18:
                gasLimit = _context32.sent;
                overrides = _objectSpread({
                  gasLimit: gasLimit.toNumber() * 2
                }, overrides);

              case 20:
                return _context32.abrupt("return", reverseRegistrar.setName(name, overrides));

              case 21:
              case "end":
                return _context32.stop();
            }
          }
        }, _callee32, this);
      }));

      function claimAndSetReverseRecordName(_x62) {
        return _claimAndSetReverseRecordName.apply(this, arguments);
      }

      return claimAndSetReverseRecordName;
    }()
  }, {
    key: "setReverseRecordName",
    value: function () {
      var _setReverseRecordName = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee33(name) {
        var account, provider, reverseNode, resolverAddr, ResolverWithoutSigner, signer, Resolver, namehash;
        return _regenerator["default"].wrap(function _callee33$(_context33) {
          while (1) {
            switch (_context33.prev = _context33.next) {
              case 0:
                _context33.next = 2;
                return (0, _web.getAccount)();

              case 2:
                account = _context33.sent;
                _context33.next = 5;
                return (0, _web.getProvider)();

              case 5:
                provider = _context33.sent;
                reverseNode = "".concat(account.slice(2), ".addr.reverse");
                _context33.next = 9;
                return this.getResolver(reverseNode);

              case 9:
                resolverAddr = _context33.sent;
                ResolverWithoutSigner = (0, _contracts.getResolverContract)({
                  address: resolverAddr,
                  provider: provider
                });
                _context33.next = 13;
                return (0, _web.getSigner)();

              case 13:
                signer = _context33.sent;
                Resolver = ResolverWithoutSigner.connect(signer);
                namehash = getNamehash(reverseNode);
                return _context33.abrupt("return", Resolver.setName(namehash, name));

              case 17:
              case "end":
                return _context33.stop();
            }
          }
        }, _callee33, this);
      }));

      function setReverseRecordName(_x63) {
        return _setReverseRecordName.apply(this, arguments);
      }

      return setReverseRecordName;
    }()
  }, {
    key: "supportsWildcard",
    value: function () {
      var _supportsWildcard = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee34(name) {
        var provider, resolverAddress, Resolver;
        return _regenerator["default"].wrap(function _callee34$(_context34) {
          while (1) {
            switch (_context34.prev = _context34.next) {
              case 0:
                _context34.next = 2;
                return (0, _web.getProvider)();

              case 2:
                provider = _context34.sent;
                _context34.next = 5;
                return this.getResolver(name);

              case 5:
                resolverAddress = _context34.sent;
                Resolver = (0, _contracts.getResolverContract)({
                  address: resolverAddress,
                  provider: provider
                });
                return _context34.abrupt("return", Resolver['supportsInterface(bytes4)'](_interfaces.interfaces['resolve']));

              case 8:
              case "end":
                return _context34.stop();
            }
          }
        }, _callee34, this);
      }));

      function supportsWildcard(_x64) {
        return _supportsWildcard.apply(this, arguments);
      }

      return supportsWildcard;
    }() // Events

  }, {
    key: "getENSEvent",
    value: function () {
      var _getENSEvent = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee35(event, _ref2) {
        var topics, fromBlock, provider, _ENS5, ensInterface, Event, filter, logs, parsed;

        return _regenerator["default"].wrap(function _callee35$(_context35) {
          while (1) {
            switch (_context35.prev = _context35.next) {
              case 0:
                topics = _ref2.topics, fromBlock = _ref2.fromBlock;
                _context35.next = 3;
                return (0, _web.getWeb3)();

              case 3:
                provider = _context35.sent;
                _ENS5 = this.ENS;
                ensInterface = new _ethers.utils.Interface(_ENS6.abi);
                Event = _ENS5.filters[event]();
                filter = {
                  fromBlock: fromBlock,
                  toBlock: 'latest',
                  address: Event.address,
                  topics: [].concat((0, _toConsumableArray2["default"])(Event.topics), (0, _toConsumableArray2["default"])(topics))
                };
                _context35.next = 10;
                return provider.getLogs(filter);

              case 10:
                logs = _context35.sent;
                parsed = logs.map(function (log) {
                  var parsedLog = ensInterface.parseLog(log);
                  return parsedLog;
                });
                return _context35.abrupt("return", parsed);

              case 13:
              case "end":
                return _context35.stop();
            }
          }
        }, _callee35, this);
      }));

      function getENSEvent(_x65, _x66) {
        return _getENSEvent.apply(this, arguments);
      }

      return getENSEvent;
    }()
  }]);
  return ENS;
}();

exports.ENS = ENS;