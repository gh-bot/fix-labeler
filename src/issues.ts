import * as config from './configuration'
import {Query} from './graphql'

interface IIssueInfo {
  id: string
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

const rgx = /(?:^|(?<= |\t|,|\.|;|"|'|`))(close|closes|closed|fixed|fix|fixes|resolve|resolves|resolved)\s+([0-9a-zA-Z'\-_]*)(?:\/*)([0-9a-zA-Z'\-_]*)#(\d+)/gim

export async function* parseIssues(
  iterator: AsyncGenerator<string>
): AsyncGenerator<Issue> {
  for await (const buffer of iterator) {
    const matches = buffer.matchAll(rgx)
    for (const match of matches) {
      yield new Issue(match)
    }
  }
}

export async function* getIssueIds(
  iterator: AsyncGenerator<Issue>
): AsyncGenerator<string> {
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
          `_${next.value.number}: issue(number: ${next.value.number}) { id }`
        )
        set.add(next.value.number)
      }

      next = await iterator.next()
    }

    if (0 < builder.length) {
      const body = builder.join('\n')
      const query = `repository(owner: "${config.owner}", name: "${config.repo}") {\n${body}\n}`
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

        yield response.id
      }
    }
  } while (null != promise)
}
