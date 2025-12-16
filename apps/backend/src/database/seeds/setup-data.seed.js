"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.SetupData = void 0;
var typeorm_1 = require("typeorm");
var option_entity_1 = require("../../modules/quiz/entities/option.entity");
var question_entity_1 = require("../../modules/quiz/entities/question.entity");
var quiz_entity_1 = require("../../modules/quiz/entities/quiz.entity");
var quiz_data_1 = require("../data/quiz.data");
var SetupData = /** @class */ (function () {
    function SetupData() {
    }
    SetupData.prototype.run = function (factory, connection) {
        return __awaiter(this, void 0, void 0, function () {
            var i, _a, quizTitle, quizDescription, questions, quiz, j, _b, question, options, que, k, _c, isCorrect, text, opt;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        console.log('quizSampleData', quiz_data_1.quizSampleData);
                        return [4 /*yield*/, (0, typeorm_1.getManager)().query('SET foreign_key_checks = 0')];
                    case 1:
                        _d.sent();
                        return [4 /*yield*/, (0, typeorm_1.getManager)().query('TRUNCATE quizes')];
                    case 2:
                        _d.sent();
                        return [4 /*yield*/, (0, typeorm_1.getManager)().query('TRUNCATE questions')];
                    case 3:
                        _d.sent();
                        return [4 /*yield*/, (0, typeorm_1.getManager)().query('TRUNCATE options')];
                    case 4:
                        _d.sent();
                        return [4 /*yield*/, (0, typeorm_1.getManager)().query('SET foreign_key_checks = 1')];
                    case 5:
                        _d.sent();
                        i = 0;
                        _d.label = 6;
                    case 6:
                        if (!(i < quiz_data_1.quizSampleData.length)) return [3 /*break*/, 15];
                        _a = quiz_data_1.quizSampleData[i], quizTitle = _a.quizTitle, quizDescription = _a.quizDescription, questions = _a.questions;
                        quiz = new quiz_entity_1.Quiz();
                        quiz.title = quizTitle;
                        quiz.description = quizDescription;
                        return [4 /*yield*/, quiz.save()];
                    case 7:
                        _d.sent();
                        j = 0;
                        _d.label = 8;
                    case 8:
                        if (!(j < questions.length)) return [3 /*break*/, 14];
                        _b = questions[j], question = _b.question, options = _b.options;
                        que = new question_entity_1.Question();
                        que.question = question;
                        que.quiz = quiz;
                        return [4 /*yield*/, que.save()];
                    case 9:
                        _d.sent();
                        k = 0;
                        _d.label = 10;
                    case 10:
                        if (!(k < options.length)) return [3 /*break*/, 13];
                        _c = options[k], isCorrect = _c.isCorrect, text = _c.text;
                        opt = new option_entity_1.Option();
                        opt.isCorrect = isCorrect;
                        opt.text = text;
                        opt.question = que;
                        return [4 /*yield*/, opt.save()];
                    case 11:
                        _d.sent();
                        _d.label = 12;
                    case 12:
                        k++;
                        return [3 /*break*/, 10];
                    case 13:
                        j++;
                        return [3 /*break*/, 8];
                    case 14:
                        i++;
                        return [3 /*break*/, 6];
                    case 15: return [2 /*return*/];
                }
            });
        });
    };
    return SetupData;
}());
exports.SetupData = SetupData;
