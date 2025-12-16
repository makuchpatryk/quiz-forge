"use strict";
exports.__esModule = true;
exports.SETTINGS = exports.MESSAGES = exports.REGEX = void 0;
var common_1 = require("@nestjs/common");
var PASSWORD_RULE = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
var PASSWORD_RULE_MESSAGE = 'Password should have 1 upper case, lowcase letter along with a number and special character.';
var VALIDATION_PIPE = new common_1.ValidationPipe({
    errorHttpStatusCode: common_1.HttpStatus.UNPROCESSABLE_ENTITY
});
exports.REGEX = {
    PASSWORD_RULE: PASSWORD_RULE
};
exports.MESSAGES = {
    PASSWORD_RULE_MESSAGE: PASSWORD_RULE_MESSAGE
};
exports.SETTINGS = {
    VALIDATION_PIPE: VALIDATION_PIPE
};
