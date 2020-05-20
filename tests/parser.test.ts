import {parseIssues} from '../src/issues'

async function* getData(): AsyncGenerator<string> {
  yield `This closes #34, closes #23, 
           and closes example_user/example_repo#42`
  yield 'fix fixes fixed resolve resolves resolved noted/noted#52 close closes closed'
  yield 'resolved noted/noted#42'
  yield `Fixed gh-bot/3d851f75-0f76-4e63-8e31-f83d5565f760#1
    
    Fixed #3
    
    Update README.md
    wip: #1
    
    Fixing "asdf"

    Fiz #1
    Fixed #1
    
    Fixed #01
    Create blank.yml`
}

test('test parsing', async () => {
  const iterator = parseIssues(getData())

  const match1 = (await iterator.next()).value
  expect(match1.number).toEqual(34)
  expect(match1.owner).toHaveLength(0)
  expect(match1.repo).toHaveLength(0)

  const match2 = (await iterator.next()).value
  expect(match2.number).toEqual(23)
  expect(match2.owner).toHaveLength(0)
  expect(match2.repo).toHaveLength(0)

  const match3 = (await iterator.next()).value
  expect(match3.number).toEqual(42)
  expect(match3.owner).toEqual('example_user')
  expect(match3.repo).toEqual('example_repo')

  const match4 = (await iterator.next()).value
  expect(match4.number).toEqual(52)
  expect(match4.owner).toEqual('noted')
  expect(match4.repo).toEqual('noted')

  const match5 = (await iterator.next()).value
  expect(match5.number).toEqual(42)
  expect(match5.owner).toEqual('noted')
  expect(match5.repo).toEqual('noted')

  const match6 = (await iterator.next()).value
  expect(match6.number).toEqual(1)
  expect(match6.owner).toEqual('gh-bot')
  expect(match6.repo).toEqual('3d851f75-0f76-4e63-8e31-f83d5565f760')

  const match7 = (await iterator.next()).value
  expect(match7.number).toEqual(3)
  expect(match7.owner).toHaveLength(0)
  expect(match7.repo).toHaveLength(0)

  const match8 = (await iterator.next()).value
  expect(match8.number).toEqual(1)
  expect(match8.owner).toHaveLength(0)
  expect(match8.repo).toHaveLength(0)

  const match9 = (await iterator.next()).value
  expect(match9.number).toEqual(1)
  expect(match9.owner).toHaveLength(0)
  expect(match9.repo).toHaveLength(0)
})

async function* getSpacedData(): AsyncGenerator<string> {
  yield `fix #34`
  yield ` fix #34`
  yield `\tfix #34`
  yield `\t fix #34`
  yield ` \t fix #34`
  yield ` \t \t fix #34`
  yield `\nfix #34`
  yield `.fix #34`
  yield `,fix #34`
  yield `;fix #34`
  yield `\'fix #34`
  yield `\"fix #34`
}

test('test dividers', async () => {
  for await (const match of parseIssues(getSpacedData())) {
    expect(match.number).toEqual(34)
    expect(match.owner).toHaveLength(0)
    expect(match.repo).toHaveLength(0)
  }
})
