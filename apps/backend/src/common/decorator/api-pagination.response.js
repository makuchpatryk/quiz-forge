"use strict";
exports.__esModule = true;
exports.ApiPaginatedResponse = void 0;
var common_1 = require("@nestjs/common");
var swagger_1 = require("@nestjs/swagger");
var paginated_dto_1 = require("../dto/paginated.dto");
var ApiPaginatedResponse = function (options) {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiExtraModels)(paginated_dto_1.PaginatedDto), (0, swagger_1.ApiOkResponse)({
        description: options.description || 'Successfully received model list',
        schema: {
            allOf: [
                { $ref: (0, swagger_1.getSchemaPath)(paginated_dto_1.PaginatedDto) },
                {
                    properties: {
                        items: {
                            type: 'array',
                            items: { $ref: (0, swagger_1.getSchemaPath)(options.model) }
                        },
                        meta: {
                            type: 'any',
                            "default": {
                                totalItems: 2,
                                itemCount: 2,
                                itemsPerPage: 2,
                                totalPages: 1,
                                currentPage: 1
                            }
                        }
                    }
                },
            ]
        }
    }));
};
exports.ApiPaginatedResponse = ApiPaginatedResponse;
