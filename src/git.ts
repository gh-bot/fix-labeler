import {spawn, spawnSync} from 'child_process'

/**
 * Gets commit messages from the repository
 * @param path — path to the repository */
export async function* getCommits(
  path: string,
  before: string,
  after: string
): AsyncGenerator<string> {
  const child = spawn(
    'git',
    ['log', '--pretty=format:%B', `${before}..${after}`],
    {cwd: path}
  )

  child.on('error', a => {
    throw a
  })

  for await (const data of child.stdout) {
    yield data.toString()
  }
}

/**
 * Returns name of the current branch
 * @param path — path to the repository */
export function getBranch(path: string): string {
  const child = spawnSync('git', ['rev-parse', '--abbrev-ref', `HEAD`], {
    cwd: path
  })
  return child.stdout?.toString().trim()
}
