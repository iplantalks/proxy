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

TODO

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
