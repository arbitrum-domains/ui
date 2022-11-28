"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getEnsStartBlock = getEnsStartBlock;
exports.validateName = validateName;
exports.isLabelValid = isLabelValid;
Object.defineProperty(exports, "isEncodedLabelhash", {
  enumerable: true,
  get: function get() {
    return _labelhash.isEncodedLabelhash;
  }
});
Object.defineProperty(exports, "isDecrypted", {
  enumerable: true,
  get: function get() {
    return _labelhash.isDecrypted;
  }
});
Object.defineProperty(exports, "decodeLabelhash", {
  enumerable: true,
  get: function get() {
    return _labelhash.decodeLabelhash;
  }
});
Object.defineProperty(exports, "encodeLabelhash", {
  enumerable: true,
  get: function get() {
    return _labelhash.encodeLabelhash;
  }
});
Object.defineProperty(exports, "labelhash", {
  enumerable: true,
  get: function get() {
    return _labelhash.labelhash;
  }
});
Object.defineProperty(exports, "encodeContenthash", {
  enumerable: true,
  get: function get() {
    return _contents.encodeContenthash;
  }
});
Object.defineProperty(exports, "decodeContenthash", {
  enumerable: true,
  get: function get() {
    return _contents.decodeContenthash;
  }
});
Object.defineProperty(exports, "isValidContenthash", {
  enumerable: true,
  get: function get() {
    return _contents.isValidContenthash;
  }
});
Object.defineProperty(exports, "getProtocolType", {
  enumerable: true,
  get: function get() {
    return _contents.getProtocolType;
  }
});
Object.defineProperty(exports, "namehash", {
  enumerable: true,
  get: function get() {
    return _namehash.namehash;
  }
});
exports.parseSearchTerm = exports.emptyAddress = exports.uniq = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _web = require("../web3");

var _address_utils = require("@0xproject/utils/lib/src/address_utils");

var _labelhash = require("./labelhash");

var _contents = require("./contents");

var _ethEnsNamehash = require("@ensdomains/eth-ens-namehash");

var _namehash = require("./namehash");

var uniq = function uniq(a) {
  return a.filter(function (item, index) {
    return a.indexOf(item) === index;
  });
};

exports.uniq = uniq;

function getEtherScanAddr() {
  return _getEtherScanAddr.apply(this, arguments);
}

function _getEtherScanAddr() {
  _getEtherScanAddr = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
    var networkId;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return (0, _web.getNetworkId)();

          case 2:
            networkId = _context.sent;
            _context.t0 = networkId;
            _context.next = _context.t0 === 421613 ? 6 : _context.t0 === '421613' ? 6 : 7;
            break;

          case 6:
            return _context.abrupt("return", 'https://goerli.arbiscan.io/');

          case 7:
            return _context.abrupt("return", 'https://goerli.arbiscan.io/');

          case 8:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _getEtherScanAddr.apply(this, arguments);
}

function getEnsStartBlock() {
  return _getEnsStartBlock.apply(this, arguments);
}

function _getEnsStartBlock() {
  _getEnsStartBlock = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2() {
    var networkId;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return (0, _web.getNetworkId)();

          case 2:
            networkId = _context2.sent;
            _context2.t0 = networkId;
            _context2.next = _context2.t0 === 421613 ? 6 : _context2.t0 === '421613' ? 6 : 7;
            break;

          case 6:
            return _context2.abrupt("return", 1909415);

          case 7:
            return _context2.abrupt("return", 0);

          case 8:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));
  return _getEnsStartBlock.apply(this, arguments);
}

var mergeLabels = function mergeLabels(labels1, labels2) {
  return labels1.map(function (label, index) {
    return label ? label : labels2[index];
  });
};

function validateName(name) {
  var nameArray = name.split('.');
  var hasEmptyLabels = nameArray.some(function (label) {
    return label.length == 0;
  });
  if (hasEmptyLabels) throw new Error('Domain cannot have empty labels');
  var normalizedArray = nameArray.map(function (label) {
    if (label === '[root]') {
      return label;
    } else {
      return (0, _labelhash.isEncodedLabelhash)(label) ? label : (0, _ethEnsNamehash.normalize)(label);
    }
  });

  try {
    return normalizedArray.join('.');
  } catch (e) {
    throw e;
  }
}

function isLabelValid(name) {
  try {
    validateName(name);

    if (name.indexOf('.') === -1) {
      return true;
    }
  } catch (e) {
    console.log(e);
    return false;
  }
}

var parseSearchTerm = function parseSearchTerm(term, validTld) {
  console.log(term, validTld);
  var regex = /[^.]+$/;

  try {
    validateName(term);
  } catch (e) {
    return 'invalid';
  }

  if (term.indexOf('.') !== -1) {
    var termArray = term.split('.');
    var tld = term.match(regex) ? term.match(regex)[0] : '';

    if (validTld) {
      if (tld === 'arb' && (0, _toConsumableArray2["default"])(termArray[termArray.length - 2]).length < 3) {
        // code-point length
        return 'short';
      }

      return 'supported';
    }

    return 'unsupported';
  } else if (_address_utils.addressUtils.isAddress(term)) {
    return 'address';
  } else {
    //check if the search term is actually a tld
    if (validTld) {
      return 'tld';
    }

    return 'search';
  }
};

exports.parseSearchTerm = parseSearchTerm;
var emptyAddress = '0x0000000000000000000000000000000000000000';
exports.emptyAddress = emptyAddress;