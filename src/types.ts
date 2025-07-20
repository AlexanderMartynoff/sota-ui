import type { IDBPDatabase, DBSchema } from 'idb'

type Cache = {
  getCache: <T = any>(key: string, defaultValue?: T | (() => T)) => T
  setCache: <T = any>(key: string, value: T) => void
  hasCache: (key: string) => boolean
  clearCache: (key?: string) => void
}

enum MessageStage {
  SenderCreated = 'sender-created',
  ServerAccepted = 'server-accepted',
  ReceiverAccepted = 'receiver-accepted',
  ReceiverReaded = 'receiver-readed',
}

interface Message {
  id: string
	sequence: number
	text: string 

	chatId: string

  // sender dependent values
	senderChatName: string
	senderChatChannel: string

	senderId: string
	senderName: string 
	senderDeviceId: string

	createTime: number
	stage: MessageStage

  read?: boolean
}

interface MessageRelations {
  sender?: Account
  chat?: Chat
}

interface ServerError {
  error: string
  code: number
}

interface StageMessage {
  id: string
  messageId: string
  stage: MessageStage
}

interface CommandMessage {
  id: string
  command: string
  args?: any
}

interface Heartbeat {
  id: string
}

enum EventTypes {
  OnSendMessage = 'event-on-send',
}

interface Settings {
  heartbeatTimeout: number
}

interface Event {
  type: EventTypes
}

interface OnMessageSendedEvent<T extends Message | StageMessage | Event | ServerError> {
  type: EventTypes
  // fields contans data about message that was sended
  packageMessage: T
  packageType: RecordTypes
}

// subcommands
enum RecordTypes {
  UserMessage = 'user-message',
  StageMessage = 'stage-message',
  HeartbeatMessage = 'heartbeat',
  CommandMessage = 'command',
}

interface InputPackage<T extends Message | StageMessage | Event | Heartbeat | CommandMessage> {
  type: RecordTypes
  message: T
}

interface OutputPackage<T extends Message | StageMessage | Heartbeat | CommandMessage> {
  type: RecordTypes
  message: T
  chanel?: string
}

// user
interface Device {
  id: string
  name: string
  user: User
}

interface Account {
  id: string
  login: string
  name: string
  deviceId: string
  deviceName: string
  avatar?: File
  avatarSrc?: String
  signed?: boolean
  active?: boolean
  online: boolean
}

interface User {
  id: string
  name: string
}

interface RuntimeUser extends User {
  online: boolean
}

enum ChatTypes {
  User = 'user',
  Group = 'group',
}

interface Chat {
  id: string
  name: string
  // for type==User channel value is user ID
  chanel: string
  type: ChatTypes
  avatar?: File,
  // description?: string
  unreadCount?: number
}

interface ChatRelations {
  caption?: {
    avatar?: File,
    author?: string,
    text?: string,
    time?: number,
  }
}

interface FileRecord {
  id: string
  name: string
  type: string
  file: File
}

interface RuntimeChat extends Chat {
  online?: boolean
}

type DatabseSchema = DBSchema & {
  messages: {
    value: Message
    key: string
    indexes: { 'chat+sequence': [string, number] },
  }
  chats: {
    value: Chat
    key: string
    indexes: { 'name': [string], 'id': [string] },
  }
  files: {
    value: FileRecord
    key: string
  },
  accounts: {
    value: Account,
    key: string,
    indexes: { 'id': [string] },
  },
  tasks: {
    value: Task,
    key: string,
    indexes: { 'id': [string] },
  },
}

enum TaskStates {
  Ready = 'ready',
  Await = 'await',
}

enum TaskTypes {
  SendMessage = 'send-message',
  LoadAccount = 'load-account',
}

enum TaskFetchActions {
  FetchAccount = 'fetch-account',
}

type Task<T = any> = {
  id: string
  state: TaskStates
  createTime: number
  type: TaskTypes
  changeStateTime: number
  payload: T
}

type IDB = IDBPDatabase<DatabseSchema>

export {
  RecordTypes,
  TaskStates,
  MessageStage,
  ChatTypes,
  EventTypes,
  TaskTypes,
  TaskFetchActions,
}

export type {
  ServerError,
  OnMessageSendedEvent,
  Event,
  DatabseSchema,
  IDB,
  Chat,
  ChatRelations,
  RuntimeChat,
  InputPackage,
  OutputPackage,
  Heartbeat,
  StageMessage,
  Message,
  CommandMessage,
  MessageRelations,
  User,
  Device,
  Account,
  RuntimeUser,
  FileRecord,
  Cache,
  Settings,
  Task,
}
