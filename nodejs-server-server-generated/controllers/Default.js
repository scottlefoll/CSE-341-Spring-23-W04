'use strict';

var utils = require('../utils/writer.js');
var Default = require('../service/DefaultService');

module.exports.contactsCreatePOST = function contactsCreatePOST (req, res, next, body) {
  Default.contactsCreatePOST(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.contactsDeleteZoe_smithsonPOST = function contactsDeleteZoe_smithsonPOST (req, res, next, body) {
  Default.contactsDeleteZoe_smithsonPOST(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.contactsFirstNameJaneGET = function contactsFirstNameJaneGET (req, res, next) {
  Default.contactsFirstNameJaneGET()
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.contactsGET = function contactsGET (req, res, next) {
  Default.contactsGET()
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.contactsJane_doeGET = function contactsJane_doeGET (req, res, next) {
  Default.contactsJane_doeGET()
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.contactsLastNameDoeGET = function contactsLastNameDoeGET (req, res, next) {
  Default.contactsLastNameDoeGET()
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.contactsUpdateZoe_smithsonPOST = function contactsUpdateZoe_smithsonPOST (req, res, next, body) {
  Default.contactsUpdateZoe_smithsonPOST(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.dbGET = function dbGET (req, res, next) {
  Default.dbGET()
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
