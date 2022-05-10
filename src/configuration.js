"use strict";
exports.__esModule = true;
exports.owner = exports.repo = exports.token = exports.label = exports.branch = exports.path = exports.MAX_QUERY_LENGTH = void 0;
var io = require("path");
var core = require("@actions/core");
var github = require("@actions/github");
var git_1 = require("./git");
/** Maximum batch of requested items */
exports.MAX_QUERY_LENGTH = 25;
// Helper data
var githubWorkspace = process.env['GITHUB_WORKSPACE'] || process.cwd();
var inputPath = core.getInput('path');
var inputLabel = core.getInput('label');
/** Path to the repository */
exports.path = !inputPath
    ? githubWorkspace
    : io.join(githubWorkspace, inputPath);
/** Branch name */
exports.branch = (0, git_1.getBranch)(exports.path);
/** Name of the label to apply*/
exports.label = inputLabel ? inputLabel : exports.branch;
/** Access token to use for authentication */
exports.token = core.getInput('token');
/** Name of the repository */
exports.repo = github.context.repo.repo;
/** Owner of the repository */
exports.owner = github.context.repo.owner;
