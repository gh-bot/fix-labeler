import * as core from '@actions/core'
import * as github from '@actions/github'
import * as config from './configuration'
import {getCommits} from './git'
import {parseIssues, getIssueInfos} from './issues'
import {processIssues} from './label'

/**
 * Executes action.
 */
async function run(): Promise<void> {
  try {
    // Name of the label
    if (!config.branch) {
      core.setFailed(
        `No repository found at path '${config.path}', quitting...`
      )
      return
    }

    // Get Path to repository
    core.info(`Analyzing repository at ${config.path}`)

    // Get commit messages from git
    const payload = github.context.payload
    core.info(
      `getting commits with: ${config.path} ${payload.before} ${payload.after}`
    )
    const commits = getCommits(config.path, payload.before, payload.after)
    const issues = parseIssues(commits)
    const infos = getIssueInfos(issues)
    const count = await processIssues(infos)

    if (0 < count) {
      core.info(`Successfully labeled ${count} issue(s)`)
    } else {
      core.info(`Nothing to label`)
    }
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message)
    }
  }
}

run()
