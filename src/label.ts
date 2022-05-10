import * as graphql from './graphql'
import * as config from './configuration'
import * as core from '@actions/core'
import {IIssueInfo} from './issues'

export interface ILabelInfo {
  id: string
  name: string
  color: string
  description: string
}

interface ILabelsPayload {
  repository: {
    labels: {
      nodes: Array<ILabelInfo>
    }
  }
}

interface IRepositoryPayload {
  repository: {
    label: null | ILabelInfo
  }
}

export async function getLabelInfo(
  branch: string,
  exact: false
): Promise<ILabelInfo | null> {
  if (exact) {
    return exactLabelInfo(branch)
  }

  const split = branch.split(/[/-]/gm)

  if (1 == split.length) {
    return exactLabelInfo(branch)
  }

  const folder = split[0]
  const version = split[1]

  const match = `${branch} ${folder} ${version}`
  const query = `repository(name: "${config.repo}", owner: "${config.owner}") {
    labels(first: 100, query: "${match}") { nodes { id color description name } }
  }`

  core.info(`Searching for labels: "${branch}", "${version}", or "${folder}"`)
  return graphql.Query(query).then(async response => {
    const payload = response as ILabelsPayload
    let upper: ILabelInfo | undefined
    let lower = null

    for (const label of payload.repository.labels.nodes) {
      if (branch == label.name) {
        // Return if found exact match
        return label
      } else if (version == label.name) {
        // Save for later first choice
        upper = label
      } else if (folder == label.name) {
        // Save for later second choice
        lower = label
      }
    }

    // If found return first choice
    if (upper) return upper

    // Return what is left
    return lower
  })
}

export async function exactLabelInfo(name: string): Promise<ILabelInfo | null> {
  const query = `repository(name: "${config.repo}", owner: "${config.owner}") {
                     label(name: "${name}") { id color description name }}`

  core.info(`Searching for label: "${name}"`)

  return graphql.Query(query).then(async response => {
    return (response as IRepositoryPayload).repository.label
  })
}

export async function labelIssues(
  label: ILabelInfo,
  iterator: AsyncGenerator<string>
): Promise<number> {
  let count = 0
  let promise = null

  do {
    const builder = Array<string>()
    let next = await iterator.next()
    while (!next.done && config.MAX_QUERY_LENGTH > builder.length) {
      builder.push(
        `_${++count}: addLabelsToLabelable(input: {labelableId: "${
          next.value
        }", labelIds: "${label.id}"}) { clientMutationId } `
      )
      next = await iterator.next()
    }

    if (null != promise) {
      await promise
    }

    if (0 < builder.length) {
      promise = graphql.Mutate(builder.join('\n'))
    } else {
      promise = null
    }
  } while (null != promise)

  return count
}

export async function processIssues(
  iterator: AsyncGenerator<IIssueInfo>
): Promise<number> {
  let count = 0
  let promise = null
  let label = null

  do {
    const builder = Array<string>()
    let next = await iterator.next()
    while (!next.done && config.MAX_QUERY_LENGTH > builder.length) {
      // Get Label if not yet found
      if (null == label) {
        label = await getLabelInfo(config.label, false)

        if (null == label) {
          core.info('No suitable label found in repository, quitting...')
          return 0
        }
      }

      // Process issues
      core.info(
        `Adding label '${label.name}' to Issue #${next.value.number} - "${next.value.title}"`
      )
      builder.push(
        `_${++count}: addLabelsToLabelable(input: {labelableId: "${
          next.value.id
        }", labelIds: "${label.id}"}) { clientMutationId } `
      )

      next = await iterator.next()
    }

    if (null != promise) {
      await promise
    }

    if (0 < builder.length) {
      promise = graphql.Mutate(builder.join('\n'))
    } else {
      promise = null
    }
  } while (null != promise)

  return count
}
