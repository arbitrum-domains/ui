"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _dnsprovejs = require("@ensdomains/dnsprovejs");

var _dnssecoraclejs = require("@ensdomains/dnssecoraclejs");

var _dnssecoraclejs2 = require("@ensdomains/dnssecoraclejs-017");

var _dnsPacket = _interopRequireDefault(require("dns-packet"));

var _web = require("./web3");

var Claim = /*#__PURE__*/function () {
  function Claim(_ref) {
    var oracle = _ref.oracle,
        isFound = _ref.isFound,
        result = _ref.result,
        textDomain = _ref.textDomain,
        encodedName = _ref.encodedName;
    (0, _classCallCheck2["default"])(this, Claim);
    this.oracle = oracle;
    this.result = result;
    this.isFound = isFound;
    this.textDomain = textDomain;
    this.encodedName = encodedName;
  }

  (0, _createClass2["default"])(Claim, [{
    key: "getProofData",
    value: function () {
      var _getProofData = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return this.oracle.getProofData(this.result);

              case 2:
                return _context.abrupt("return", _context.sent);

              case 3:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function getProofData() {
        return _getProofData.apply(this, arguments);
      }

      return getProofData;
    }()
    /**
     * returns `Oracle <https://dnsprovejs.readthedocs.io/en/latest/libraries.html#oracle>`_ object
     */

  }, {
    key: "getOracle",
    value: function getOracle() {
      return this.oracle;
    }
    /**
     * returns `DnsResult <https://dnsprovejs.readthedocs.io/en/latest/libraries.html#dnsresult>`_ object
     */

  }, {
    key: "getResult",
    value: function getResult() {
      return this.result;
    }
    /**
     * returns owner ETH address from the DNS record.
     */

  }, {
    key: "getOwner",
    value: function getOwner() {
      if (this.result && this.result.answer) {
        return this.result.answer.records[0].data.toString().split('=')[1];
      } else {
        return null;
      }
    }
  }]);
  return Claim;
}();

var DNSRegistrar = /*#__PURE__*/function () {
  function DNSRegistrar(oracleAddress) {
    var isOld = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    (0, _classCallCheck2["default"])(this, DNSRegistrar);
    this.oracleAddress = oracleAddress;
    this.isOld = isOld;

    if (isOld) {
      this.OracleClass = _dnssecoraclejs2.Oracle;
    } else {
      this.OracleClass = _dnssecoraclejs.Oracle;
    }
  }
  /**
   * returns a claim object which allows you to claim
   * the ownership of a given name on ENS by submitting the proof
   * into DNSSEC oracle as well as claiming the name via the registrar
   * @param {string} name - name of the domain you want to claim
   */


  (0, _createClass2["default"])(DNSRegistrar, [{
    key: "claim",
    value: function () {
      var _claim = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(name) {
        var encodedName, textDomain, prover, provider;
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                encodedName = '0x' + _dnsPacket["default"].name.encode(name).toString('hex');
                textDomain = '_ens.' + name;
                prover = _dnsprovejs.DNSProver.create('https://cloudflare-dns.com/dns-query');
                _context2.next = 5;
                return (0, _web.getProvider)();

              case 5:
                provider = _context2.sent;
                _context2.t0 = Claim;
                _context2.t1 = new this.OracleClass(this.oracleAddress, provider);
                _context2.next = 10;
                return prover.queryWithProof('TXT', textDomain);

              case 10:
                _context2.t2 = _context2.sent;
                _context2.t3 = textDomain;
                _context2.t4 = encodedName;
                _context2.t5 = {
                  oracle: _context2.t1,
                  result: _context2.t2,
                  isFound: true,
                  textDomain: _context2.t3,
                  encodedName: _context2.t4
                };
                return _context2.abrupt("return", new _context2.t0(_context2.t5));

              case 15:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function claim(_x) {
        return _claim.apply(this, arguments);
      }

      return claim;
    }()
  }]);
  return DNSRegistrar;
}();

var _default = DNSRegistrar;
exports["default"] = _default;