var js = `
/**
 * Proxy request to another host
 * @param {string | URL} url
 * @param {number | null} cache time to live in seconds
 * @returns
 */
async function proxy(url, ttl = null) {
  url = new URL(url)
  var host = url.hostname
  url.hostname = 'proxy.iplan-talks.workers.dev'
  return await fetch(url, { headers: { 'X-Host': host, 'X-Cache': ttl ? 'public, max-age=' + ttl : undefined } })
}
`

export default {
  /**
   * Proxy handler
   * @param {Request} req
   * @returns
   */
  async fetch(req) {
    if (
      req.method === 'OPTIONS' &&
      req.headers.get('origin') &&
      (req.headers.get('origin').endsWith('italks.com.ua') ||
        req.headers.get('origin').endsWith('mac-blog.org.ua') ||
        req.headers.get('origin').includes('localhost'))
    ) {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': req.headers.get('origin'),
          'Access-Control-Allow-Methods': '*',
          'Access-Control-Allow-Headers': '*'
        }
      })
    }

    var cache = req.headers.get('x-cache-control')
    var url = new URL(req.url)
    var host = req.headers.get('x-host')
    if (req.method === 'GET' && (url.pathname === '/' || !host)) {
      return new Response(js, { headers: { 'Content-Type': 'text/javascript; charset=utf-8' } })
    }

    url.host = host
    if (cache) {
      req.cf = {
        cacheTtl: parseInt(cache.match(/\d+/)),
        cacheEverything: true,
      }
    }
    var res = await fetch(url, req)
    res = new Response(res.body, res)
    res.headers.set('Access-Control-Allow-Origin', req.headers.get('origin'))
    res.headers.set('Access-Control-Allow-Methods', '*')
    res.headers.set('Access-Control-Allow-Headers', '*')

    
    if (cache) {
      res.headers.set('Cache-Control', cache)
      if (res.headers.has('Expires')) {
        res.headers.delete('Expires')
      }
      if (res.headers.has('Set-Cookie')) {
        res.headers.delete('Set-Cookie')
      }
      if (res.headers.has('Pragma')) {
        res.headers.delete('Pragma')
      }
    }

    return res
  }
}
