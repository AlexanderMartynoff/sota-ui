import type { Account, Message, MessageRelations, Chat, StageMessage, Task, DatabseSchema, ChatRelations } from '../../types'
import { TaskStates } from '../../types'

import type { Scope } from './scope'


async function getAccount(scope: Scope<DatabseSchema, ['accounts'], 'readonly' | 'readwrite'>, id: string): Promise<Account | undefined> {
  return await scope.accounts.get(id)
}

async function updateAccount(scope: Scope<DatabseSchema, ['accounts'], 'readwrite'>, accountId: string, values: Partial<Omit<Account, 'id' | 'deviceId'>>): Promise<void> {
  const account = await scope.accounts.get(accountId)

  if (account == undefined) {
    throw new Error(`Account "${accountId}" no found`)
  }

  await scope.accounts.put({ ...account, ...values })
}

async function putAccount(scope: Scope<DatabseSchema, ['accounts'], 'readwrite'>, account: Account): Promise<void> {
  await scope.accounts.put(account)
}

// chats
async function getChat(scope: Scope<DatabseSchema, ['chats'], 'readonly' | 'readwrite'>, id: string): Promise<Chat | undefined> {
  return await scope.chats.get(id)
}

async function addChat(scope: Scope<DatabseSchema, ['chats'], 'readwrite'>, chat: Chat) {
  await scope.chats.add(chat)
}

async function selectChats(scope: Scope<DatabseSchema, ['chats', 'accounts', 'messages'], 'readonly'>, where: (chat: Chat) => boolean): Promise<Array<Chat & ChatRelations>> {
  const records: Array<Chat & ChatRelations> = []

  for await (const chatCursor of scope.chats) {
    if (!where(chatCursor.value)) {
      continue
    }

    // NOTE: channel is user ID only for chat type==user
    const accountCursor = await scope.accounts.index('id').openCursor(IDBKeyRange.only([
      chatCursor.value.chanel,
    ]))

    const captionMessagesQuery = IDBKeyRange.bound(
      [chatCursor.value.id, Number.MIN_SAFE_INTEGER],
      [chatCursor.value.id, Number.MAX_SAFE_INTEGER],
    )

    const captionMessageCursor = await scope.messages.index('chat+sequence').openCursor(captionMessagesQuery, 'prev')

    const captionAccountCursor = captionMessageCursor?.value.senderId ? await scope.accounts.index('id').openCursor(IDBKeyRange.only(
      [captionMessageCursor.value.senderId],
    )) : null
 
    records.push({
      ...chatCursor.value,
      avatar: accountCursor?.value.avatar,
      caption: {
        author: captionAccountCursor?.value.name,
        text: captionMessageCursor?.value.text,
        time: captionMessageCursor?.value.createTime,
      },
    })
  }

  return records
}

async function deleteChat(scope: Scope<DatabseSchema, ['chats', 'messages'], 'readwrite'>, chatId: string): Promise<void> {
  await scope.chats.delete(chatId)

  const query = IDBKeyRange.bound(
    [chatId, Number.MIN_SAFE_INTEGER],
    [chatId, Number.MAX_SAFE_INTEGER],
  )

  for await (const cursor of scope.messages.index('chat+sequence').iterate(query)) {
    await cursor.delete()
  }
}

// messages
async function setMessageStage(scope: Scope<DatabseSchema, ['messages'], 'readwrite'>, stageMessage: StageMessage): Promise<void> {
  const message = await scope.messages.get(stageMessage.messageId)

  if (message == undefined) {
    return
  }

  await scope.messages.put({
    ...message,
    stage: stageMessage.stage,
  })
}

async function addMessage(scope: Scope<DatabseSchema, ['messages'], 'readwrite'>, values: Omit<Message, 'sequence' | 'createTime'>): Promise<Message> {
  const lastMessageCursor = await scope.messages.index('chat+sequence').openCursor(IDBKeyRange.bound(
    [values.chatId, Number.MIN_SAFE_INTEGER],
    [values.chatId, Number.MAX_SAFE_INTEGER],
  ), 'prev')

  const message = {
    ...values,
    createTime: Date.now(),
    sequence: lastMessageCursor ? lastMessageCursor.value.sequence + 1 : 1,
  }

  await scope.messages.add(message)

  return message
}

async function putMessage(scope: Scope<DatabseSchema, ['chats', 'messages', 'accounts'], 'readwrite'>, message: Message) {
  await scope.messages.put(message)
}

async function selectMessages(scope: Scope<DatabseSchema, ['chats', 'messages', 'accounts'], 'readonly'>, chatId: string, limit: number): Promise<{ records: Array<Message & MessageRelations>, finish: boolean }> {
  const messagesIndex = scope.messages.index('chat+sequence')
  const accountsIndex = scope.accounts.index('id')
  const chatsIndex = scope.chats.index('id')

  const messagesQuery = IDBKeyRange.bound(
    [chatId, Number.MIN_SAFE_INTEGER],
    [chatId, Number.MAX_SAFE_INTEGER],
  )

  const records: Array<Message & MessageRelations> = []

  for await (const cursor of messagesIndex.iterate(messagesQuery, 'prev')) {
    const message = cursor.value

    if (message.chatId == undefined || message.senderId == undefined) {
      continue
    }

    const chat = await chatsIndex.get(IDBKeyRange.only([message.chatId]))
    const sender = await accountsIndex.get(IDBKeyRange.only([message.senderId]))

    records.unshift({
      ...message,
      sender,
      chat,
    })

    if (records.length >= limit) {
      break
    }
  }

  // last message in index by query
  const cursor = await messagesIndex.openCursor(messagesQuery, 'next')

  return {
    records,
    finish: records[0]?.id == cursor?.value.id,
  }
}

// tasks
async function addTask(scope: Scope<DatabseSchema, ['tasks'], 'readwrite'>, task: Task) {
  await scope.tasks.add(task)
}

async function deleteTasks(scope: Scope<DatabseSchema, ['tasks'], 'readwrite'>, where: (task: Task) => boolean): Promise<void> {
  for await (const cursor of scope.tasks.iterate()) {
    if (where(cursor.value)) {
      await cursor.delete()
    }
  }
}

async function *selectTasks(scope: Scope<DatabseSchema, ['tasks'], 'readwrite'>, timeout: number): AsyncGenerator<{task: Task<any>, update: (values: Partial<Task>) => void}> {
  for await (const cursor of scope.tasks.iterate()) {
    if (cursor.value.state == TaskStates.Ready || cursor.value.state == TaskStates.Await && Date.now() - cursor.value.changeStateTime > timeout) {
      yield {
        task: cursor.value,
        update: (values: Partial<Task>) => {
          if (values.state) {
            values = {...values, changeStateTime: Date.now()}
          }
          cursor.update({...cursor.value, ...values})
        },
      }
    }
  }
}

export {
  putMessage,
  addMessage,
  setMessageStage,
  selectMessages,

  addChat,
  getChat,
  selectChats,
  deleteChat,

  getAccount,
  putAccount,
  updateAccount,
  
  addTask,
  deleteTasks,
  selectTasks,
}
