import {exactLabelInfo, labelIssues, getLabelInfo} from '../src/label'

test('testing no matching label', async () => {
  const result = await exactLabelInfo('xxx')
  expect(result).toBeNull()
})

test('testing label <master>', async () => {
  const result = await exactLabelInfo('master')
  expect(result?.name).toEqual('master')
})

test('testing label <xxx/2.0.0>', async () => {
  const result = await getLabelInfo('xxx/2.0.0')
  expect(result).toBeNull()
})

test('testing label <test/2.0.0>', async () => {
  const result = await getLabelInfo('test/2.0.0')
  expect(result?.name).toEqual('test')
})

test('testing label <test-2.0.0>', async () => {
  const result = await getLabelInfo('test-2.0.0')
  expect(result?.name).toEqual('test')
})

test('testing label <test/1.0.0>', async () => {
  const result = await getLabelInfo('test/1.0.0')
  expect(result?.name).toEqual('test/1.0.0')
})

test('testing label <test-1.0.0>', async () => {
  const result = await getLabelInfo('test-1.0.0')
  expect(result?.name).toEqual('1.0.0')
})

test('testing label <branch/1.0.0>', async () => {
  const result = await getLabelInfo('branch/1.0.0')
  expect(result?.name).toEqual('1.0.0')
})

test('testing label <branch/2.0.0>', async () => {
  const result = await getLabelInfo('branch/2.0.0', true)
  expect(result).toBeNull()
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
