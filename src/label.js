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
        while (_) try {
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
exports.processIssues = exports.labelIssues = exports.exactLabelInfo = exports.getLabelInfo = void 0;
var graphql = require("./graphql");
var config = require("./configuration");
var core = require("@actions/core");
function getLabelInfo(branch, exact) {
    if (exact === void 0) { exact = false; }
    return __awaiter(this, void 0, void 0, function () {
        var split, folder, version, match, query;
        var _this = this;
        return __generator(this, function (_a) {
            if (exact) {
                return [2 /*return*/, exactLabelInfo(branch)];
            }
            split = branch.split(/[\/-]/gm);
            if (1 == split.length) {
                return [2 /*return*/, exactLabelInfo(branch)];
            }
            folder = split[0];
            version = split[1];
            match = "".concat(branch, " ").concat(folder, " ").concat(version);
            query = "repository(name: \"".concat(config.repo, "\", owner: \"").concat(config.owner, "\") {\n    labels(first: 100, query: \"").concat(match, "\") { nodes { id color description name } }\n  }");
            core.info("Searching for labels: \"".concat(branch, "\", \"").concat(version, "\", or \"").concat(folder, "\""));
            return [2 /*return*/, graphql.Query(query).then(function (response) { return __awaiter(_this, void 0, void 0, function () {
                    var payload, upper, lower, _i, _a, label;
                    return __generator(this, function (_b) {
                        payload = response;
                        lower = null;
                        for (_i = 0, _a = payload.repository.labels.nodes; _i < _a.length; _i++) {
                            label = _a[_i];
                            if (branch == label.name) {
                                // Return if found exact match
                                return [2 /*return*/, label];
                            }
                            else if (version == label.name) {
                                // Save for later first choice
                                upper = label;
                            }
                            else if (folder == label.name) {
                                // Save for later second choice
                                lower = label;
                            }
                        }
                        // If found return first choice
                        if (upper)
                            return [2 /*return*/, upper
                                // Return what is left
                            ];
                        // Return what is left
                        return [2 /*return*/, lower];
                    });
                }); })];
        });
    });
}
exports.getLabelInfo = getLabelInfo;
function exactLabelInfo(name) {
    return __awaiter(this, void 0, void 0, function () {
        var query;
        var _this = this;
        return __generator(this, function (_a) {
            query = "repository(name: \"".concat(config.repo, "\", owner: \"").concat(config.owner, "\") {\n                     label(name: \"").concat(name, "\") { id color description name }}");
            core.info("Searching for label: \"".concat(name, "\""));
            return [2 /*return*/, graphql.Query(query).then(function (response) { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        return [2 /*return*/, response.repository.label];
                    });
                }); })];
        });
    });
}
exports.exactLabelInfo = exactLabelInfo;
function labelIssues(label, iterator) {
    return __awaiter(this, void 0, void 0, function () {
        var count, promise, builder, next;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    count = 0;
                    promise = null;
                    _a.label = 1;
                case 1:
                    builder = Array();
                    return [4 /*yield*/, iterator.next()];
                case 2:
                    next = _a.sent();
                    _a.label = 3;
                case 3:
                    if (!(!next.done && config.MAX_QUERY_LENGTH > builder.length)) return [3 /*break*/, 5];
                    builder.push("_".concat(++count, ": addLabelsToLabelable(input: {labelableId: \"").concat(next.value, "\", labelIds: \"").concat(label.id, "\"}) { clientMutationId } "));
                    return [4 /*yield*/, iterator.next()];
                case 4:
                    next = _a.sent();
                    return [3 /*break*/, 3];
                case 5:
                    if (!(null != promise)) return [3 /*break*/, 7];
                    return [4 /*yield*/, promise];
                case 6:
                    _a.sent();
                    _a.label = 7;
                case 7:
                    if (0 < builder.length) {
                        promise = graphql.Mutate(builder.join('\n'));
                    }
                    else {
                        promise = null;
                    }
                    _a.label = 8;
                case 8:
                    if (null != promise) return [3 /*break*/, 1];
                    _a.label = 9;
                case 9: return [2 /*return*/, count];
            }
        });
    });
}
exports.labelIssues = labelIssues;
function processIssues(iterator) {
    return __awaiter(this, void 0, void 0, function () {
        var count, promise, label, builder, next;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    count = 0;
                    promise = null;
                    label = null;
                    _a.label = 1;
                case 1:
                    builder = Array();
                    return [4 /*yield*/, iterator.next()];
                case 2:
                    next = _a.sent();
                    _a.label = 3;
                case 3:
                    if (!(!next.done && config.MAX_QUERY_LENGTH > builder.length)) return [3 /*break*/, 7];
                    if (!(null == label)) return [3 /*break*/, 5];
                    return [4 /*yield*/, getLabelInfo(config.label)];
                case 4:
                    label = _a.sent();
                    if (null == label) {
                        core.info('No suitable label found in repository, quitting...');
                        return [2 /*return*/, 0];
                    }
                    _a.label = 5;
                case 5:
                    // Process issues
                    core.info("Adding label '".concat(label.name, "' to Issue #").concat(next.value.number, " - \"").concat(next.value.title, "\""));
                    builder.push("_".concat(++count, ": addLabelsToLabelable(input: {labelableId: \"").concat(next.value.id, "\", labelIds: \"").concat(label.id, "\"}) { clientMutationId } "));
                    return [4 /*yield*/, iterator.next()];
                case 6:
                    next = _a.sent();
                    return [3 /*break*/, 3];
                case 7:
                    if (!(null != promise)) return [3 /*break*/, 9];
                    return [4 /*yield*/, promise];
                case 8:
                    _a.sent();
                    _a.label = 9;
                case 9:
                    if (0 < builder.length) {
                        promise = graphql.Mutate(builder.join('\n'));
                    }
                    else {
                        promise = null;
                    }
                    _a.label = 10;
                case 10:
                    if (null != promise) return [3 /*break*/, 1];
                    _a.label = 11;
                case 11: return [2 /*return*/, count];
            }
        });
    });
}
exports.processIssues = processIssues;
