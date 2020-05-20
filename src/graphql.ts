import {request} from '@octokit/request'
import * as config from './configuration'

const headers = {
  authorization: `token ${config.token}`,
  'user-agent': 'gh-bot/merged-issue-labeler'
}

export async function Query(data: string): Promise<unknown> {
  return request('POST /graphql', {
    headers,
    query: `query { \n ${data} \n }`
  }).then(async response => {
    return response.data.data
  })
}

export async function Mutate(data: string): Promise<unknown> {
  return request('POST /graphql', {
    headers,
    query: `mutation { \n ${data} \n }`
  }).then(async response => {
    return response.data.data
  })
}
