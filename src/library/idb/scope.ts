import type { IDBPObjectStore, StoreNames, DBSchema, IDBPDatabase, IDBPTransaction } from 'idb'


type TxMode = 'readonly' | 'readwrite'

type Names<Schema extends DBSchema | unknown> = Array<StoreNames<Schema>>

type Store<Schema extends DBSchema | unknown, Name extends Names<Schema>[number], Mode extends TxMode> = Omit<IDBPObjectStore<Schema, Names<Schema>, Name, Mode>, 'transaction'>

type Scope<Schema extends DBSchema | unknown, TxStores extends Names<Schema>, Mode extends TxMode> = {
  [key in TxStores[number]]: Store<Schema, key, Mode>
}

function open<Schema extends DBSchema | unknown, TxStores extends Names<Schema>, Mode extends TxMode>(idb: IDBPDatabase<Schema>, names: TxStores, mode: Mode): {scope: Scope<Schema, TxStores, typeof mode>, tx: IDBPTransaction<Schema, TxStores, typeof mode>} {
  const tx = idb.transaction(names, mode)

  const scope = {} as Scope<Schema, TxStores, typeof mode>

  for (const name of names) {
    scope[name] = tx.objectStore(name)
  }

  return { scope, tx }
}

function scope<Schema extends DBSchema | unknown, TxStores extends Names<Schema>>(idb: IDBPDatabase<Schema>, ...names: TxStores): Scope<Schema, TxStores, 'readonly'> {
  const { scope } = open(idb, names, 'readonly')
  return scope
}

function run<Schema extends DBSchema | unknown, TxStores extends Names<Schema>, T, Mode extends TxMode = 'readonly'>(worker: (scope: Scope<Schema, TxStores, typeof mode>, tx: IDBPTransaction<Schema, TxStores, typeof mode>) => T | Promise<T>, idb: IDBPDatabase<Schema>, names: TxStores, mode: Mode): Promise<T> {
  const { scope, tx } = open(idb, names, mode)

  const value = worker(
    scope,
    tx,
  )

  return Promise.resolve(tx.done.then(() => value))
}

export type {
  Store,
  Scope,
}

export {
  scope,
  run,
}
