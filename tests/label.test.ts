import {getLabelledInfo, labelIssues} from '../src/label'

test('testing no matching label', async () => {
  const result = await getLabelledInfo('xxx')
  expect(result).toBeNull()
})

test('testing label <master>', async () => {
  const result = await getLabelledInfo('master')
  expect(result?.name).toEqual('master')
})

async function* getData(): AsyncGenerator<string> {
  yield 'MDU6SXNzdWU2MjE0MDgyNzk='
  yield 'MDU6SXNzdWU2MjE0MDgzMzY='
  yield 'MDU6SXNzdWU2MjE0MDgzNjM='
  yield 'MDU6SXNzdWU2MjE0MDg0MTU='
}

test('test getting IDs', async () => {
  const label = {
    id: 'MDU6TGFiZWwyMDc0MjQ2NDQ4',
    name: 'master',
    color: 'string',
    description: 'string'
  }

  const count = await labelIssues(label, getData())
  expect(count).toBeGreaterThan(0)
})
