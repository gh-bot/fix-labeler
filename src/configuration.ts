import * as io from 'path'
import * as core from '@actions/core'
import * as github from '@actions/github'
import {getBranch} from './git'

/** Maximum batch of requested items */
export const MAX_QUERY_LENGTH = 25

// Helper data
const githubWorkspace = process.env['GITHUB_WORKSPACE'] || process.cwd()
const inputPath = core.getInput('path')
const inputLabel = core.getInput('label')

/** Path to the repository */
export const path = !inputPath
  ? githubWorkspace
  : io.join(githubWorkspace, inputPath)

/** Branch name */
export const branch = getBranch(path)

/** Name of the label to apply*/
export const label = inputLabel ? inputLabel : branch

/** Access token to use for authentication */
export const token = core.getInput('token')

/** Name of the repository */
export const repo: string = github.context.repo.repo

/** Owner of the repository */
export const owner = github.context.repo.owner
