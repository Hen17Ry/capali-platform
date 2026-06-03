import { connectMongo } from '../utils/mongo'

export default defineNitroPlugin(async (nitroApp) => {
  await connectMongo()
})
