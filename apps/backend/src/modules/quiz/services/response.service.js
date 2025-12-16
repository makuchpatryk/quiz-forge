"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.ResponseService = void 0;
var common_1 = require("@nestjs/common");
var event_emitter_1 = require("@nestjs/event-emitter");
var event_constants_1 = require("../../../common/constants/event.constants");
var ResponseService = /** @class */ (function () {
    function ResponseService() {
    }
    ResponseService.prototype.handleIfResponseIsCorrect = function (payload) {
        console.log('handleIfResponseIsCorrect', payload);
    };
    __decorate([
        (0, event_emitter_1.OnEvent)(event_constants_1.events.RESPONSE_SUBMITTED)
    ], ResponseService.prototype, "handleIfResponseIsCorrect");
    ResponseService = __decorate([
        (0, common_1.Injectable)()
    ], ResponseService);
    return ResponseService;
}());
exports.ResponseService = ResponseService;
