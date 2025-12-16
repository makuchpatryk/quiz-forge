"use strict";
exports.__esModule = true;
exports.jwtConfig = void 0;
var app_config_1 = require("./app.config");
exports.jwtConfig = {
    useFactory: function () {
        return {
            secret: (0, app_config_1["default"])().appSecret,
            signOptions: { expiresIn: '1d' }
        };
    }
};
