# SGA Senator Application, Nomination, and Audit System

The purpose of this application is to streamline the application and nomination processes for senators at SGA (Student Government Association).

## Technologies

Monorepo: [nx](https://nx.dev)

Common:

- [TypeScript](https://www.typescriptlang.org/)
- Test framework: [Jest](https://jestjs.io/)

Frontend:

- Library: [React](https://react.dev/)
- Component library: [Material UI](https://mui.com/)
- CSS library: [styled-components](https://styled-components.com/)

Backend:

- Framework: [NestJS](https://nestjs.com/)
- Database: TBD

## Setting up the development environment

Prerequisites: make sure everything is installed

1. [yarn](https://yarnpkg.com/): `npm install --global yarn`
2. [nx](https://nx.dev/): `yarn global add nx@latest`

First, clone the repo and `cd` into the directory

```bash
git clone https://github.com/SGAOperationalAffairs/nomination-system.git
cd nomination-system
```

Then, install the dependencies

```bash
yarn
```

## Running the app

To run just the frontend,

```bash
nx serve frontend
```

To run just the backend,

```bash
nx serve backend
```

To run both the frontend and backend with one command,

```bash
nx run-many -t serve -p frontend backend
```

The frontend will be at http://localhost:4200/ and the backend will be at http://localhost:3000/.
