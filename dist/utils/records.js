"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validateRecord = validateRecord;
exports.getPlaceholder = getPlaceholder;
exports.EMPTY_ADDRESS = void 0;

var _utils = require("@0xproject/utils");

var _contents = require("./contents");

function validateRecord(record) {
  if (!record.type) {
    return false;
  }

  var type = record.type,
      value = record.value;

  if (type == 'content' && record.contentType === 'oldcontent') {
    return value.length > 32;
  }

  switch (type) {
    case 'address':
      return _utils.addressUtils.isAddress(value);

    case 'content':
      return (0, _contents.validateContent)(value);

    default:
      throw new Error('Unrecognised record type');
  }
}

function getPlaceholder(recordType, contentType) {
  switch (recordType) {
    case 'address':
      return 'Enter an Ethereum address';

    case 'content':
      if (contentType === 'contenthash') {
        return 'Enter a content hash (eg: ipfs://..., bzz://..., onion://..., onion3://..., sia://..., arweave://...)';
      } else {
        return 'Enter a content';
      }

    default:
      return '';
  }
}

var EMPTY_ADDRESS = '0x0000000000000000000000000000000000000000';
exports.EMPTY_ADDRESS = EMPTY_ADDRESS;