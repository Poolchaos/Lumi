# PersonalFit Frontend# PersonalFit Frontend# React + TypeScript + Vite



React + TypeScript frontend for PersonalFit.



## Quick StartModern React + TypeScript frontend for PersonalFit fitness tracking.This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.



```bash

npm install

npm run dev## Quick StartCurrently, two official plugins are available:

```



Open http://localhost:5173

```bash- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh

## Environment

npm install- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

Create `.env`:

```npm run dev    # http://localhost:5173

VITE_API_URL=http://localhost:5000

```npm run build  # Production build## React Compiler



## Tech Stack```



- React 18 + TypeScriptThe React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

- Vite

- TailwindCSS 3## Tech Stack

- React Router 6

- TanStack Query## Expanding the ESLint configuration

- Zustand (auth)

- Axios- React 18 + TypeScript



## Build- Vite (build tool)If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:



```bash- TailwindCSS 3

npm run build  # Output: dist/

```- React Router 6```js


- TanStack Query (API state)export default defineConfig([

- Zustand (auth state)  globalIgnores(['dist']),

- Axios  {

    files: ['**/*.{ts,tsx}'],

## Features    extends: [

      // Other configs...

✅ Authentication (login/signup with JWT)

✅ Dashboard with workout stats        // Remove tseslint.configs.recommended and replace with this

✅ Profile management        tseslint.configs.recommendedTypeChecked,

✅ Equipment inventory        // Alternatively, use this for stricter rules

✅ Body metrics & progress photos        tseslint.configs.strictTypeChecked,

✅ AI workout generation        // Optionally, add this for stylistic rules

✅ Accountability tracking with streaks        tseslint.configs.stylisticTypeChecked,



## Environment      // Other configs...

    ],

Create `.env`:    languageOptions: {

```      parserOptions: {

VITE_API_URL=http://localhost:5000        project: ['./tsconfig.node.json', './tsconfig.app.json'],

```        tsconfigRootDir: import.meta.dirname,

      },

## Architecture      // other options...

    },

- `/src/api` - API client & endpoints  },

- `/src/pages` - Page components])

- `/src/components` - Reusable components```

- `/src/store` - Zustand state

- `/src/types` - TypeScript typesYou can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:



## Development```js

// eslint.config.js

Backend must be running on port 5000.import reactX from 'eslint-plugin-react-x'

import reactDom from 'eslint-plugin-react-dom'

Access frontend at http://localhost:5173

export default defineConfig([

##Production Ready  globalIgnores(['dist']),

  {

All features working, build tested, ready for deployment.    files: ['**/*.{ts,tsx}'],

    extends: [

See `../DOCKER_TEST_RESULTS.md` for full test results.      // Other configs...

      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
