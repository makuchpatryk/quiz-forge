"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.AppModule = void 0;
var common_1 = require("@nestjs/common");
var config_1 = require("@nestjs/config");
var typeorm_1 = require("@nestjs/typeorm");
var app_controller_1 = require("./app.controller");
var app_service_1 = require("./app.service");
var typeorm_config_1 = require("./config/typeorm.config");
var quiz_module_1 = require("./modules/quiz/quiz.module");
var user_module_1 = require("./modules/user/user.module");
var auth_module_1 = require("./modules/auth/auth.module");
var api_token_check_middleware_1 = require("./common/middleware/api-token-check.middleware");
var event_emitter_1 = require("@nestjs/event-emitter");
var search_module_1 = require("./modules/search/search.module");
var platform_express_1 = require("@nestjs/platform-express");
var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule.prototype.configure = function (consumer) {
        consumer
            .apply(api_token_check_middleware_1.ApiTokenCheckMiddleware)
            .forRoutes({ path: '/', method: common_1.RequestMethod.ALL });
    };
    AppModule = __decorate([
        (0, common_1.Module)({
            imports: [
                config_1.ConfigModule.forRoot({ isGlobal: true }),
                typeorm_1.TypeOrmModule.forRootAsync(typeorm_config_1.typeOrmAsyncConfig),
                event_emitter_1.EventEmitterModule.forRoot(),
                platform_express_1.MulterModule.register({ dest: './uploads' }),
                quiz_module_1.QuizModule,
                user_module_1.UserModule,
                auth_module_1.AuthModule,
                search_module_1.SearchModule,
            ],
            controllers: [app_controller_1.AppController],
            providers: [app_service_1.AppService]
        })
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
