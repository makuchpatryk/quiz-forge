"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.QuizModule = void 0;
var common_1 = require("@nestjs/common");
var typeorm_1 = require("@nestjs/typeorm");
var question_controller_1 = require("./controllers/question.controller");
var question_repository_1 = require("./repositories/question.repository");
var question_service_1 = require("./services/question.service");
var quiz_controller_1 = require("./controllers/quiz.controller");
var quiz_repository_1 = require("./repositories/quiz.repository");
var quiz_service_1 = require("./services/quiz.service");
var option_repository_1 = require("./repositories/option.repository");
var option_controller_1 = require("./controllers/option.controller");
var option_service_1 = require("./services/option.service");
var user_module_1 = require("../user/user.module");
var response_controller_1 = require("./controllers/response.controller");
var response_service_1 = require("./services/response.service");
var QuizModule = /** @class */ (function () {
    function QuizModule() {
    }
    QuizModule = __decorate([
        (0, common_1.Module)({
            controllers: [
                quiz_controller_1.QuizController,
                question_controller_1.QuestionController,
                option_controller_1.OptionController,
                response_controller_1.ResponseController,
            ],
            imports: [
                typeorm_1.TypeOrmModule.forFeature([
                    quiz_repository_1.QuizRepository,
                    question_repository_1.QuestionRepository,
                    option_repository_1.OptionRepository,
                ]),
                user_module_1.UserModule,
            ],
            providers: [quiz_service_1.QuizService, question_service_1.QuestionService, option_service_1.OptionService, response_service_1.ResponseService]
        })
    ], QuizModule);
    return QuizModule;
}());
exports.QuizModule = QuizModule;
