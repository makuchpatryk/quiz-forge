"use strict";
exports.__esModule = true;
var falso_1 = require("@ngneat/falso");
var typeorm_seeding_1 = require("typeorm-seeding");
var quiz_entity_1 = require("../../modules/quiz/entities/quiz.entity");
(0, typeorm_seeding_1.define)(quiz_entity_1.Quiz, function () {
    var quiz = new quiz_entity_1.Quiz();
    quiz.title = (0, falso_1.randSentence)();
    quiz.description = (0, falso_1.randParagraph)();
    return quiz;
});
