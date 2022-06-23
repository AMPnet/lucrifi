
# Nuxt 3 Minimal Starter

## Supported Env variables

```bash
NUXT_PUBLIC_BACKEND_URL=https://eth-staging.ampnet.io/api/blockchain-api/v1
NUXT_PUBLIC_REQUEST_PAYMENT_REDIRECT=https://rsend.vercel.app/request-send/${id}/action
NUXT_PUBLIC_GTAG_ID="G-XXXXXXXX"
```

Look at the [nuxt 3 documentation](https://v3.nuxtjs.org) to learn more.

## Setup

Make sure to install the dependencies:

```bash
# yarn
yarn install

# npm
npm install

# pnpm
pnpm install --shamefully-hoist
```

## Development Server

Start the development server on http://localhost:3000

```bash
npm run dev
```

## Production

Build the application for production:

```bash
npm run build
```

Locally preview production build:

```bash
npm run preview
```

Checkout the [deployment documentation](https://v3.nuxtjs.org/guide/deploy/presets) for more information.
