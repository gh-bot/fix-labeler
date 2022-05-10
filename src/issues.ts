import * as core from '@actions/core'
import * as config from './configuration'
import {Query} from './graphql'

export interface IIssueInfo {
  id: string
  number: number
  title: string
}

interface IRepositoryPayload {
  repository: {[key: string]: IIssueInfo | null}
}

export class Issue {
  private _match: string[]

  constructor(match: string[]) {
    this._match = match
  }

  get match(): string {
    return this._match[0]
  }
  get verb(): string {
    return this._match[1]
  }
  get owner(): string {
    return this._match[2]
  }
  get repo(): string {
    return this._match[3]
  }
  get number(): number {
    return Number.parseInt(this._match[4])
  }
}

const rgx =
  /(?:^|(?<= |\t|,|\.|;|"|'|`))(close|closes|closed|fixed|fix|fixes|resolve|resolves|resolved)\s+([0-9a-zA-Z'\-_]*)(?:\/*)([0-9a-zA-Z'\-_]*)#(\d+)/gim

export async function* parseIssues(
  iterator: AsyncGenerator<string>
): AsyncGenerator<Issue> {
  for await (const buffer of iterator) {
    core.info(`scanning commit: ${buffer}`)
    const matches = buffer.matchAll(rgx)
    core.info(`matches found: ${matches}`)
    for (const match of matches) {
      yield new Issue(match)
    }
  }
}

export async function* getIssueInfos(
  iterator: AsyncGenerator<Issue>
): AsyncGenerator<IIssueInfo> {
  let promise = null
  const set = new Set<number>()

  do {
    let data: {[key: string]: IIssueInfo | null} | undefined

    if (null != promise) {
      data = await promise
    }

    let next = await iterator.next()
    const builder = Array<string>()
    while (!next.done && config.MAX_QUERY_LENGTH > builder.length) {
      if (!set.has(next.value.number)) {
        builder.push(
          `_${next.value.number}: issue(number: ${next.value.number}) { id number title }`
        )
        set.add(next.value.number)
      }

      next = await iterator.next()
    }
    core.info(`builder after loop: ${builder}`)

    if (0 < builder.length) {
      const body = builder.join('\n')
      const query = `repository(owner: "${config.owner}", name: "${config.repo}") {\n${body}\n}`
      core.info(`query sending: ${query}`)
      promise = Query(query).then(response => {
        return (response as IRepositoryPayload).repository
      })
    } else {
      promise = null
    }

    if (data) {
      for (const property of Object.keys(data)) {
        const response = data[property]
        if (!response) continue

        yield response
      }
    }
  } while (null != promise)
}
