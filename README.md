
# LucriFi on Nuxt 3

## Supported Env variables

```bash
NUXT_PUBLIC_BACKEND_URL=https://invest-api.ampnet.io/api/blockchain-api/v1
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

## Supporting new chains

1. Add all the new chain tokens in `public/tokens/list.json`, along with token images in the `public/tokens/images`
2. If supporting native token for the chain, the native token list item in `list.json` **must have `address` property set to `0x0000000000000000000000000000000000000000`**. This is how it's determined if the token is native in the code.
3. Generate a new project API key on backend for the new chain using new chain's `chainId`
4. Create a new env variable in `nuxt.config.ts` that will keep the API key property for the new chain.
5. Add the new chain data in `stores/networks.ts`
