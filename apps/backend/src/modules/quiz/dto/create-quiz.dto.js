"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.CreateQuizDto = void 0;
var swagger_1 = require("@nestjs/swagger");
var class_validator_1 = require("class-validator");
var CreateQuizDto = /** @class */ (function () {
    function CreateQuizDto() {
    }
    __decorate([
        (0, swagger_1.ApiProperty)({
            description: 'The title of the quiz',
            example: 'How good are your with Laravel?'
        }),
        (0, class_validator_1.IsNotEmpty)({ message: 'The quiz should have a title' }),
        (0, class_validator_1.Length)(3, 255)
    ], CreateQuizDto.prototype, "title");
    __decorate([
        (0, swagger_1.ApiProperty)({
            description: 'A small description for the user',
            example: 'This quiz will ask your questions on Laravel and test your knowledge.'
        }),
        (0, class_validator_1.IsNotEmpty)(),
        (0, class_validator_1.Length)(3)
    ], CreateQuizDto.prototype, "description");
    return CreateQuizDto;
}());
exports.CreateQuizDto = CreateQuizDto;
