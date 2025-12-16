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
exports.Question = void 0;
var swagger_1 = require("@nestjs/swagger");
var typeorm_1 = require("typeorm");
var option_entity_1 = require("./option.entity");
var quiz_entity_1 = require("./quiz.entity");
var Question = /** @class */ (function (_super) {
    __extends(Question, _super);
    function Question() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        (0, swagger_1.ApiProperty)({
            description: 'The primary ID of question.',
            example: 1
        }),
        (0, typeorm_1.PrimaryGeneratedColumn)()
    ], Question.prototype, "id");
    __decorate([
        (0, swagger_1.ApiProperty)({
            description: 'The actual question',
            example: 'What is the question?'
        }),
        (0, typeorm_1.Column)({
            type: 'varchar'
        })
    ], Question.prototype, "question");
    __decorate([
        (0, swagger_1.ApiProperty)({
            description: 'Quiz of the question'
        }),
        (0, typeorm_1.ManyToOne)(function () { return quiz_entity_1.Quiz; }, function (quiz) { return quiz.questions; })
    ], Question.prototype, "quiz");
    __decorate([
        (0, swagger_1.ApiProperty)({
            description: 'Options of the question'
        }),
        (0, typeorm_1.OneToMany)(function () { return option_entity_1.Option; }, function (option) { return option.question; })
    ], Question.prototype, "options");
    Question = __decorate([
        (0, typeorm_1.Entity)('questions')
    ], Question);
    return Question;
}(typeorm_1.BaseEntity));
exports.Question = Question;
