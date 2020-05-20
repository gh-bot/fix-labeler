import * as git from '../src/git'
import {spawnSync} from 'child_process'

test.only('test git branch detection', async () => {
  const child = spawnSync('git', ['rev-parse', '--abbrev-ref', `HEAD`], {
    cwd: process.cwd()
  })
  const branch = child.stdout?.toString().trim()
  const path = process.cwd()

  expect(git.getBranch(path)).toEqual(branch)
})

test('test commit messages', async () => {
  const builder = Array<string>()
  const path = process.cwd()

  for await (const data of git.getCommits(
    path,
    'a92b77e9c7e837c80b6d22a0ea414e89ef40b08d',
    '7fa12f1834d9c58e96d7b4ef44ac502112b066e8'
  )) {
    builder.push(data)
  }

  const summary = builder.join()
  expect(summary).toMatch(
    /feat:\sEnumerated\sall\scommit\smessages(\n+)Added issue generator(\n+)Formatting(\n+)Fixing lint issues/g
  )
})
