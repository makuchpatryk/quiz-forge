"use strict";
exports.__esModule = true;
exports.ApiTokenCheckMiddleware = void 0;
var api_token_payement_exception_1 = require("../exceptions/api-token-payement.exception");
var ApiTokenCheckMiddleware = /** @class */ (function () {
    function ApiTokenCheckMiddleware() {
    }
    ApiTokenCheckMiddleware.prototype.use = function (req, res, next) {
        if (req.headers['api-token'] !== 'my-token') {
            throw new api_token_payement_exception_1.ApiTokenPaymentException();
        }
        next();
    };
    return ApiTokenCheckMiddleware;
}());
exports.ApiTokenCheckMiddleware = ApiTokenCheckMiddleware;
