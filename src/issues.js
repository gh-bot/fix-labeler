"use strict";
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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __await = (this && this.__await) || function (v) { return this instanceof __await ? (this.v = v, this) : new __await(v); }
var __asyncGenerator = (this && this.__asyncGenerator) || function (thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
};
exports.__esModule = true;
exports.getIssueInfos = exports.parseIssues = exports.Issue = void 0;
var core = require("@actions/core");
var config = require("./configuration");
var graphql_1 = require("./graphql");
var Issue = /** @class */ (function () {
    function Issue(match) {
        this._match = match;
    }
    Object.defineProperty(Issue.prototype, "match", {
        get: function () {
            return this._match[0];
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Issue.prototype, "verb", {
        get: function () {
            return this._match[1];
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Issue.prototype, "owner", {
        get: function () {
            return this._match[2];
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Issue.prototype, "repo", {
        get: function () {
            return this._match[3];
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Issue.prototype, "number", {
        get: function () {
            return Number.parseInt(this._match[4]);
        },
        enumerable: false,
        configurable: true
    });
    return Issue;
}());
exports.Issue = Issue;
var rgx = /(?:^|(?<= |\t|,|\.|;|"|'|`))(close|closes|closed|fixed|fix|fixes|resolve|resolves|resolved)\s+([0-9a-zA-Z'\-_]*)(?:\/*)([0-9a-zA-Z'\-_]*)#(\d+)/gim;
function parseIssues(iterator) {
    return __asyncGenerator(this, arguments, function parseIssues_1() {
        var iterator_1, iterator_1_1, buffer, matches, _i, matches_1, match, e_1_1;
        var e_1, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 9, 10, 15]);
                    iterator_1 = __asyncValues(iterator);
                    _b.label = 1;
                case 1: return [4 /*yield*/, __await(iterator_1.next())];
                case 2:
                    if (!(iterator_1_1 = _b.sent(), !iterator_1_1.done)) return [3 /*break*/, 8];
                    buffer = iterator_1_1.value;
                    core.info("scanning commit: ".concat(buffer));
                    matches = buffer.matchAll(rgx);
                    core.info("matches found: ".concat(matches));
                    _i = 0, matches_1 = matches;
                    _b.label = 3;
                case 3:
                    if (!(_i < matches_1.length)) return [3 /*break*/, 7];
                    match = matches_1[_i];
                    return [4 /*yield*/, __await(new Issue(match))];
                case 4: return [4 /*yield*/, _b.sent()];
                case 5:
                    _b.sent();
                    _b.label = 6;
                case 6:
                    _i++;
                    return [3 /*break*/, 3];
                case 7: return [3 /*break*/, 1];
                case 8: return [3 /*break*/, 15];
                case 9:
                    e_1_1 = _b.sent();
                    e_1 = { error: e_1_1 };
                    return [3 /*break*/, 15];
                case 10:
                    _b.trys.push([10, , 13, 14]);
                    if (!(iterator_1_1 && !iterator_1_1.done && (_a = iterator_1["return"]))) return [3 /*break*/, 12];
                    return [4 /*yield*/, __await(_a.call(iterator_1))];
                case 11:
                    _b.sent();
                    _b.label = 12;
                case 12: return [3 /*break*/, 14];
                case 13:
                    if (e_1) throw e_1.error;
                    return [7 /*endfinally*/];
                case 14: return [7 /*endfinally*/];
                case 15: return [2 /*return*/];
            }
        });
    });
}
exports.parseIssues = parseIssues;
function getIssueInfos(iterator) {
    return __asyncGenerator(this, arguments, function getIssueInfos_1() {
        var promise, set, data, next, builder, body, query, _i, _a, property, response;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    promise = null;
                    set = new Set();
                    _b.label = 1;
                case 1:
                    data = void 0;
                    if (!(null != promise)) return [3 /*break*/, 3];
                    return [4 /*yield*/, __await(promise)];
                case 2:
                    data = _b.sent();
                    _b.label = 3;
                case 3: return [4 /*yield*/, __await(iterator.next())];
                case 4:
                    next = _b.sent();
                    builder = Array();
                    _b.label = 5;
                case 5:
                    if (!(!next.done && config.MAX_QUERY_LENGTH > builder.length)) return [3 /*break*/, 7];
                    if (!set.has(next.value.number)) {
                        builder.push("_".concat(next.value.number, ": issue(number: ").concat(next.value.number, ") { id number title }"));
                        set.add(next.value.number);
                    }
                    return [4 /*yield*/, __await(iterator.next())];
                case 6:
                    next = _b.sent();
                    return [3 /*break*/, 5];
                case 7:
                    core.info("builder after loop: ".concat(builder));
                    if (0 < builder.length) {
                        body = builder.join('\n');
                        query = "repository(owner: \"".concat(config.owner, "\", name: \"").concat(config.repo, "\") {\n").concat(body, "\n}");
                        core.info("query sending: ".concat(query));
                        promise = (0, graphql_1.Query)(query).then(function (response) {
                            return response.repository;
                        });
                    }
                    else {
                        promise = null;
                    }
                    if (!data) return [3 /*break*/, 12];
                    _i = 0, _a = Object.keys(data);
                    _b.label = 8;
                case 8:
                    if (!(_i < _a.length)) return [3 /*break*/, 12];
                    property = _a[_i];
                    response = data[property];
                    if (!response)
                        return [3 /*break*/, 11];
                    return [4 /*yield*/, __await(response)];
                case 9: return [4 /*yield*/, _b.sent()];
                case 10:
                    _b.sent();
                    _b.label = 11;
                case 11:
                    _i++;
                    return [3 /*break*/, 8];
                case 12:
                    if (null != promise) return [3 /*break*/, 1];
                    _b.label = 13;
                case 13: return [2 /*return*/];
            }
        });
    });
}
exports.getIssueInfos = getIssueInfos;
