## Simple Url Shortener Frontend

Backend: [simple-url-shortener-backend](https://github.com/majesnix/simple-url-shortener-backend)

Frontend for the Simple Url Shortener written with [SolidJS](https://www.solidjs.com).

Deployed version can be found here: [dcl.re](https://dcl.re)

### Configuration

Both values are baked into the bundle at build time.

| Variable    | Example               | Purpose                                                      |
|-------------|-----------------------|--------------------------------------------------------------|
| `VITE_API`  | `https://api.dcl.re`  | Base URL of the backend API                                  |
| `VITE_BASE` | `dcl.re`              | Public host of this frontend, used to build the short links  |

For local development put them in a `.env.local` file.

### Development

Requires Node 24 (see `.tool-versions`) and Yarn 1.

```sh
yarn install
yarn dev          # dev server on http://localhost:3000
yarn test:run     # unit tests (vitest + msw)
yarn typecheck    # tsc --noEmit
yarn build        # production build into dist/
```

### Docker

```sh
docker build \
  --build-arg VITE_API=https://api.example.com \
  --build-arg VITE_BASE=example.com \
  --build-arg VERSION=dev \
  -t sus-frontend .
docker run -p 8080:80 sus-frontend
```

CI (`.github/workflows/ci.yml`) runs typecheck, tests and build, then pushes
`sus-frontend:<package.json version>`, `sus-frontend:sha-<commit>` and
`sus-frontend:latest`. `VITE_API` / `VITE_BASE` are read from repository
variables, falling back to secrets of the same name.

### Routes

- `/` shorten a link
- `/terms` terms of use
- `/<short>` resolves the short link through the API and redirects
