export const wsPeers = new Map<string, any>()

export const notifyUser = (userId: string, data: any) => {
  const peer = wsPeers.get(userId)
  if (peer) {
    peer.send(JSON.stringify(data))
  }
}
