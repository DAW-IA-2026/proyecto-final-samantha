import { networkInterfaces } from 'os'

export function getLocalIp() {
  const interfaces = networkInterfaces()
  let fallback = null

  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        if (/^(192\.168\.|10\.|172\.(1[6-9]|2\d|3[01])\.)/.test(iface.address)) {
          return iface.address
        }
        if (!fallback) {
          fallback = iface.address
        }
      }
    }
  }

  return fallback || 'localhost'
}
