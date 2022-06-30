
# Nuxt 3 Minimal Starter

## Supported Env variables

```bash
NUXT_PUBLIC_BACKEND_URL=https://eth-staging.ampnet.io/api/blockchain-api/v1
NUXT_PUBLIC_REQUEST_PAYMENT_REDIRECT=https://rsend.vercel.app/request-send/${id}/action
NUXT_PUBLIC_CONNECT_WALLET_REDIRECT=https://staging.ampnet.io/connect/${id}
NUXT_PUBLIC_GTAG_ID="G-XXXXXXXX"
NUXT_POLYGON_API_KEY=<API-KEY>
NUXT_ETHEREUM_API_KEY=<API-KEY>
NUXT_BSC_API_KEY=<API-KEY>
NUXT_GNOSIS_API_KEY=<API-KEY>
NUXT_FANTOM_API_KEY=<API-KEY>
NUXT_MOONRIVER_API_KEY=<API-KEY>
NUXT_AVAX_API_KEY=<API-KEY>
NUXT_AURORA_API_KEY=<API-KEY>
```

Look at the [nuxt 3 documentation](https://v3.nuxtjs.org) to learn more.

## Setup

### Prepare your environemnt

Follow [this](https://v3.nuxtjs.org/getting-started/quick-start#prerequisites
)

### Dependencies

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
