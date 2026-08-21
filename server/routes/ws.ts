import { wsPeers } from '~~/server/utils/ws'

export default defineWebSocketHandler({
  open(peer) {
    const url = new URL(peer.request.url, 'http://localhost')
    const userId = url.searchParams.get('userId')
    if (userId) {
      wsPeers.set(userId, peer)
      console.log(`[WebSocket] User ${userId} connected`)
    }
  },
  message(peer, message) {
    // Le serveur n'a pas besoin de lire les messages WS. 
    // L'envoi de messages passe par HTTP POST /api/messages/send
    // On peut répondre à un ping si nécessaire
    if (message.text() === 'ping') {
      peer.send('pong')
    }
  },
  close(peer) {
    const url = new URL(peer.request.url, 'http://localhost')
    const userId = url.searchParams.get('userId')
    if (userId) {
      wsPeers.delete(userId)
      console.log(`[WebSocket] User ${userId} disconnected`)
    }
  },
  error(peer, error) {
    console.error('[WebSocket] Error', error)
  }
})
