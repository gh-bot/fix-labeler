import * as core from '@actions/core'
import * as github from '@actions/github'
import * as config from './configuration'
import {getCommits, getBranch} from './git'
import {getIssueIds, parseIssues} from './issues'
import {exactLabelInfo, labelIssues, ILabelInfo, getLabelInfo} from './label'

/**
 * Executes action.
 */
async function run(): Promise<void> {
  try {
    // Get Path to repository
    const path = config.path
    core.info(`Analyzing repository at ${path}`)

    // Name of the label
    const branch = getBranch(path)
    if (!branch) {
      core.setFailed(`No repository found at path '${path}'`)
      return
    }

    // Find label
    let label: ILabelInfo | null;
    if (config.label) {
      label = await exactLabelInfo(config.label)
    } else {
      label = await getLabelInfo(branch)
    }

    // Nothing to do if no label
    if (null == label) {
      core.info(
        `Label '${config.label}' does not exist in repository '${github.context.repo.owner}/${github.context.repo.repo}', quitting...`
      )
      return
    }

    core.info(`Applying label "${config.label}" to issues`)
    const payload = github.context.payload

    // Get commit messages from git
    const commits = getCommits(path, payload.before, payload.after)
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
