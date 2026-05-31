export const useApi = () => {
  const { $api } = useNuxtApp()

  return {
    get: (url, opts = {}) => $api(url, { method: 'GET', ...opts }),
    post: (url, body, opts = {}) => $api(url, { method: 'POST', body, ...opts }),
    put: (url, body, opts = {}) => $api(url, { method: 'PUT', body, ...opts }),
    patch: (url, body, opts = {}) => $api(url, { method: 'PATCH', body, ...opts }),
    delete: (url, opts = {}) => $api(url, { method: 'DELETE', ...opts })
  }
}
