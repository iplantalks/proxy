# proxy

Small proxy service

We have many small online tools

Tools need to retrieve data from other services like Yahoo, Privat24, etc

But to do that we need bother wither servers and backends

Exactly to solve that - proxy service is used

It does allow direct requests from frontend to be prixied whatever you want without the need to have backend

Also it will handle cors for you

## Usage

Here is an simple usage example

```html
<script src="https://proxy.iplan-talks.workers.dev"></script>
<script type="module">
  const data = await proxy(
    'https://http://query2.finance.yahoo.com/v10/finance/quotesummary/v8/finance/chart/META?period1=1672524000&period2=1705953041&interval=1d'
  )
</script>
```

or pass your implementation, aka:

```js
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
```

Proxy does expect `X-Host` header with actual hostname, and optional `X-Cache` header that will be added to response

## How it works

In cloudflare we have dedicated [proxy](https://dash.cloudflare.com/f09bf7b4ddbc71a3a07f7ffb5638163b/workers/services/view/proxy/production) worker where we are deploing our [script](index.js)

## Development

```
npm i
npm run dev
open http://localhost:8787
```

## Deployment

Deployment are automated and done behind the scene after merge to main branch

To deploy manually you need two environment variables:

Account identifier pointing to italks cloudflare account

```bash
export CLOUDFLARE_ACCOUNT_ID=f09bf7b4ddbc71a3a07f7ffb5638163b
```

Your token

```bash
export CLOUDFLARE_API_TOKEN=xxxxxxxxxx
```

Token can be created [here](https://dash.cloudflare.com/profile/api-tokens), use "Edit Cloudflare Workers" template, it has all required permissions

Both environment variables are added as secrets to github, for automated deployments

In case if you already have tokens for other accounts just save them to another wariable and do soemthing like this:

```bash
export CLOUDFLARE_ACCOUNT_ID=$ITALKS_CLOUDFLARE_ACCOUNT_ID
export CLOUDFLARE_API_TOKEN=$ITALKS_CLOUDFLARE_API_TOKEN
npm run deploy
```
