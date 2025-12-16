"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.Option = void 0;
var swagger_1 = require("@nestjs/swagger");
var typeorm_1 = require("typeorm");
var question_entity_1 = require("./question.entity");
var Option = /** @class */ (function (_super) {
    __extends(Option, _super);
    function Option() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        (0, swagger_1.ApiProperty)({ description: 'Primary key as Option ID', example: 1 }),
        (0, typeorm_1.PrimaryGeneratedColumn)()
    ], Option.prototype, "id");
    __decorate([
        (0, swagger_1.ApiProperty)({ description: 'The actual option', example: 'Owl' }),
        (0, typeorm_1.Column)({
            type: 'varchar'
        })
    ], Option.prototype, "text");
    __decorate([
        (0, swagger_1.ApiProperty)({ description: 'Whether option is correct', example: true }),
        (0, typeorm_1.Column)({
            type: 'boolean'
        })
    ], Option.prototype, "isCorrect");
    __decorate([
        (0, typeorm_1.ManyToOne)(function () { return question_entity_1.Question; }, function (question) { return question.options; })
    ], Option.prototype, "question");
    Option = __decorate([
        (0, typeorm_1.Entity)('options')
    ], Option);
    return Option;
}(typeorm_1.BaseEntity));
exports.Option = Option;
