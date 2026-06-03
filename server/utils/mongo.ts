import mongoose from 'mongoose'

let isConnected = false

export const connectMongo = async () => {
  if (isConnected) return
  
  const uri = process.env.MONGODB_URI
  if (!uri) {
    console.error('❌ MONGODB_URI non définie.')
    return
  }

  try {
    await mongoose.connect(uri)
    isConnected = true
    console.log('✅ Connecté à MongoDB (Forum)')
  } catch (err) {
    console.error('❌ Erreur de connexion à MongoDB:', err)
  }
}
