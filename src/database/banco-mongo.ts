import { MongoClient } from 'mongodb'

const cliente = new MongoClient(process.env.MONGO_URI!);'   '
await cliente.connect()
const db = cliente.db(process.env.MONGO_DB)

export { db };