# Zodyac Core
A modular Node.JS framework for [Zod](https://npmjs.com/package/zod) maniacs. Turn your zod schemas into a fully functional REST API with minimal effort.

## Getting started
Please refer to the [documentation](https://zodyac.dev/docs/getting-started) for a detailed guide on how to get started.

### TL;DR:
Install the CLI tool:

```bash
npm install @zodyac/cli
```

Create a new project:

```bash
zy init
```

Run the project:

```bash
zy serve
```

## Features
- Dependency injection

  Swap out modules with ease. Controll your state with the power of dependency injection.

- Lifecycle

  All the modules are synced, so you can be sure that everything is initialized in the right order.


- Declarative

  Everything is a module, composable and extendable. Create and plug them right into the dependency tree.

- Type safety

  Written in Typescript with Zod request validation, type safety becomes guaranteed.

- Dev tools

  A set of tools for building, watching, serving, and linting your app with zero config.

- Extensible

  Build your own modules. Connect any database or engine.


## Concept
The main idea of this project is to create a fully-modular Node.js framework with bare minimum core decisions so that developers can have full control over how they create REST API servers, fast and minimalistic way.

[Zod](https://npmjs.com/package/zod) is an amazing tool for describing everything from data models to API endpoints. So why not putting it in the very heart of a framework?

## License
MIT
