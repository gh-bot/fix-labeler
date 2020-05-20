import * as graphql from './graphql'
import * as config from './configuration'

interface ILabelInfo {
  id: string
  name: string
  color: string
  description: string
}

interface IRepositoryPayload {
  repository: {
    label: null | ILabelInfo
  }
}

export async function getLabelledInfo(
  name: string
): Promise<ILabelInfo | null> {
  const query = `repository(name: "${config.repo}", owner: "${config.owner}") {
                     label(name: "${name}") { id color description name }}`

  return graphql
    .Query(query)
    .then(async response => (response as IRepositoryPayload).repository.label)
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
