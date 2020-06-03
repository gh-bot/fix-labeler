import {Issue, getIssueInfos} from '../src/issues'

async function* getData(): AsyncGenerator<Issue> {
  yield new Issue(['x', 'y', '', '', '3'])
  yield new Issue(['x', 'y', '', '', '0'])
  yield new Issue(['x', 'y', '', '', '4'])
  yield new Issue(['x', 'y', 'gh-bot', 'fix-labeler', '1'])
}


test('test getting Issue Infos', async () => {
  const iterator = getIssueInfos(getData())

  const match1 = (await iterator.next()).value
  expect(match1).not.toBeNull()

  const match2 = (await iterator.next()).value
  expect(match2).not.toBeNull()

  const match3 = await iterator.next()
  expect(match3.value).not.toBeNull()
  expect(match3.value.number).toBe(1)

  const match4 = await iterator.next()
  expect(match4.done).toBeTruthy()
})
