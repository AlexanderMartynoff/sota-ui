// utils
import { v5 as uuidv5 } from 'uuid'

function tail(str: string, length=null) {
  return str.slice(str.length - (length || 5))
}

function tails(strs: string[]): string {
  return strs.map(str => tail(str)).join(', ')
}

function hash(...strings: string[]): string {
  return uuidv5(strings.sort().join('-'), uuidv5.URL)
}

function truncate(value: string, length: number): string {
  if (value.length > length) {
    return value.substring(0, length) + '...'
  }

  return value
}

export {
  truncate,
  tail,
  tails,
  hash,
}
