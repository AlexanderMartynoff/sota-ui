import type { Account, Settings } from '../types'

async function updateAccount(id: string, values: Partial<Account>): Promise<Response> {
  const avatar = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (event) => {
      resolve(reader.result as string)
    }

    reader.onerror = (event) => {
      reject(reader.error)
    }

    if (values.avatar == undefined) {
      throw new Error()
    }

    reader.readAsDataURL(values.avatar)
  })

  const body = JSON.stringify({
    ...values,
    avatar,
  })

  return fetch(`/v1/api/user/patch?id=${id}`, {
    method: 'PUT',
    body,
  })
}

async function signUpAccount(account: Account): Promise<Response> {
  return fetch('/v1/api/user/sign-up', {
    method: 'PUT',
    body: JSON.stringify(account),
  })
}

async function fetchSettings(): Promise<Settings | void> {
  const response = await fetch('/v1/api/settings')

  if (response.ok) {
    return await response.json()
  }
}

async function signInAccount(login: string, secret: string, device: { id: string, name: string }): Promise<Response> {
  return fetch('/v1/api/user/sign-in', {
    method: 'PUT',
    body: JSON.stringify({ login, secret, device }),
  })
}

async function getAccount(id: string): Promise<Account | void> {
  const response = await fetch(`/v1/api/user?id=${id}`, {
    method: 'GET',
  })

  if (response.ok) {
    const values = await response.json()

    // base64 to File
    const avatar = values.avatar ? await fetch(values.avatar).then(async reponse => {
      const blob = await reponse.blob()

      return new File([blob], 'avatar', {
        type: blob.type,
      })
    }) : null

    if (avatar) {
      return {
        ...values,
        avatar,
      }
    }

    return values
  }
}

export {
  fetchSettings,
  updateAccount,
  signUpAccount,
  signInAccount,
  getAccount,
}
