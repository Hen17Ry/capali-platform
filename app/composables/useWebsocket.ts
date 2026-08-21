import { ref } from 'vue'

const unreadMessagesCount = ref(0)
const lastMessage = ref<any>(null)
let socket: WebSocket | null = null

export const useWebsocket = () => {
  const { user, isAuthenticated } = useAuth()
  
  const connect = () => {
    if (import.meta.client && isAuthenticated.value && user.value?.id) {
      if (socket) return
      
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
      const wsUrl = `${protocol}//${window.location.host}/ws?userId=${user.value.id}`
      
      socket = new WebSocket(wsUrl)
      
      socket.onopen = () => {
        // eslint-disable-next-line no-console
        console.log('[WebSocket] Connected')
      }
      
      socket.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data)
          if (payload.type === 'new_message') {
            lastMessage.value = payload.data
            // Incrémente seulement si on n'est pas déjà sur la page du message
            const currentPath = window.location.pathname
            if (!currentPath.includes(`/dashboard/messages/${payload.data.mentorshipId}`)) {
              unreadMessagesCount.value++
            }
          }
        } catch (e) {
          // eslint-disable-next-line no-console
          console.error('Erreur parsing websocket msg', e)
        }
      }
      
      socket.onclose = () => {
        // eslint-disable-next-line no-console
        console.log('[WebSocket] Disconnected')
        socket = null
        // Reconnect after 3s
        setTimeout(() => connect(), 3000)
      }
    }
  }

  const disconnect = () => {
    if (socket) {
      socket.close()
      socket = null
    }
  }
  
  const resetUnreadCount = () => {
    unreadMessagesCount.value = 0
  }

  return {
    connect,
    disconnect,
    unreadMessagesCount,
    lastMessage,
    resetUnreadCount
  }
}
