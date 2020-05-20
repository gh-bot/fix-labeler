import {Issue, getIssueIds} from '../src/issues'

async function* getData(): AsyncGenerator<Issue> {
  yield new Issue(['x', 'y', '', '', '3'])
  yield new Issue(['x', 'y', '', '', '0'])
  yield new Issue(['x', 'y', '', '', '4'])
  yield new Issue(['x', 'y', 'gh-bot', '3d851f75-0f76-4e63-8e31-f83d5565f760', '5'])
}

test('test getting IDs', async () => {
  const iterator = getIssueIds(getData())

  const match1 = (await iterator.next()).value
  expect(match1).not.toBeNull()

  const match2 = (await iterator.next()).value
  expect(match2).not.toBeNull()

  const match3 = await iterator.next()
  expect(match3.value).not.toBeNull()

  const match4 = await iterator.next()
  expect(match4.done).toBeTruthy()
})
