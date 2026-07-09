import { connectMongo } from '../utils/mongo'

export default defineNitroPlugin(async (_nitroApp) => {
  await connectMongo()
})
