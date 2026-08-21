import { Server as Engine } from 'engine.io'
import { Server } from 'socket.io'
import { defineNitroPlugin } from 'nitropack/runtime'

export default defineNitroPlugin((nitroApp) => {
  const engine = new Engine()
  const io = new Server()

  io.bind(engine)

  io.on('connection', (socket) => {
    // L'utilisateur envoie son ID lors de la connexion pour qu'on puisse lui cibler des messages
    const userId = socket.handshake.query.userId as string
    if (userId) {
      socket.join(userId)
    }

    socket.on('disconnect', () => {
      // Nettoyage si nécessaire
    })
  })

  // Stocker l'instance IO globalement pour l'utiliser dans nos routes API
  // @ts-expect-error global property
  global.__io = io

  nitroApp.router.use('/socket.io/', defineEventHandler({
    handler(event) {
      engine.handleRequest(event.node.req, event.node.res)
      event._handled = true
    },
    websocket: {
      open(peer) {
        // @ts-expect-error private method and property
        const nodeReq = peer._internal.nodeReq
        
        // Let Engine.io handle the upgrade
        engine.handleUpgrade(nodeReq, nodeReq.socket, Buffer.alloc(0))
      }
    }
  }))
})
