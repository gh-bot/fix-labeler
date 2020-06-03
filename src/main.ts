import * as core from '@actions/core'
import * as github from '@actions/github'
import * as config from './configuration'
import {getCommits} from './git'
import {getIssueIds, parseIssues} from './issues'
import {labelIssues, getLabelInfo} from './label'

/**
 * Executes action.
 */
async function run(): Promise<void> {
  try {
    // Get Path to repository
    core.info(`Analyzing repository at ${config.path}`)

    // Name of the label
    if (!config.branch) {
      core.setFailed(`No repository found at path '${config.path}'`)
      return
    }

    // Find label
    const label = await getLabelInfo(config.label)

    // Nothing to do if no label
    if (null == label) {
      core.info(
        `No suitable label found in repository '${github.context.repo.owner}/${github.context.repo.repo}', quitting...`
      )
      return
    }

    core.info(`Applying label "${label.name}" to issues`)
    const payload = github.context.payload

    // Get commit messages from git
    const commits = getCommits(config.path, payload.before, payload.after)
    const issues = parseIssues(commits)
    const issueIds = getIssueIds(issues)
    const count = await labelIssues(label, issueIds)

    if (0 < count) {
      core.info(`Successfully labeled ${count} issues`)
    } else {
      core.info(`Nothing to label`)
    }
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
