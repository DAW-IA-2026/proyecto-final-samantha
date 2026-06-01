import { networkInterfaces } from 'os'

export function getLocalIp() {
  // Priority 1: explicit env var for known local network
  const envIp = process.env.NUXT_PUBLIC_LOCAL_IP
  if (envIp && envIp.trim().length > 0) {
    return envIp.trim()
  }

  // Priority 2: auto-detect from network interfaces
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
