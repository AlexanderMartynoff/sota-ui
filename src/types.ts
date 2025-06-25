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

enum EventType {
  OnSendMessage = 'event-on-send',
}

interface Settings {
  heartbeatTimeout: number
}

interface Event {
  type: EventType
}

interface OnMessageSendedEvent<T extends Message | StageMessage | Event | ServerError> {
  type: EventType
  // fields contans data about message that was sended
  packageMessage: T
  packageType: RecordType
}

// subcommands
enum RecordType {
  UserMessage = 'user-message',
  StageMessage = 'stage-message',
  HeartbeatMessage = 'heartbeat',
  CommandMessage = 'command',
}

interface InputPackage<T extends Message | StageMessage | Event | Heartbeat | CommandMessage> {
  type: RecordType
  message: T
}

interface OutputPackage<T extends Message | StageMessage | Heartbeat | CommandMessage> {
  type: RecordType
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
  online?: boolean
}

interface User {
  id: string
  name: string
}

interface RuntimeUser extends User {
  online: boolean
}

enum ChatType {
  User = 'user',
  Group = 'group',
}

interface Chat {
  id: string
  name: string
  // for type==User channel value is user ID
  chanel: string
  type: ChatType
  avatar?: File,
  // description?: string
  unreadCount?: number
}

interface ChatRelations {
  caption?: {
    files?: any[],
    avatar?: File,
    author?: string,
    text?: string,
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
  Send = 'Send',
  Fetch = 'Fetch',
}

type Task<T = any> = {
  id: string
  state: TaskStates
  createTime: number
  type?: TaskTypes
  changeStateTime: number
  payload: T

  // setup?: (payload: any) => void
}

type IDB = IDBPDatabase<DatabseSchema>

export {
  RecordType,
  TaskStates,
  MessageStage,
  ChatType,
}

export type {
  ServerError,
  EventType,
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
