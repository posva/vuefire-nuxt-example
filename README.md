# Nuxt example with VueFire (and nuxt-vuefire)

- [Demo on Stackblitz](https://stackblitz.com/github/posva/vuefire-vite-example?file=README.md)
- [Deployed Demo](#TODO)

This is a working example of Nuxt + VueFire created with:

```sh
npx nuxi init my-vuefire-nuxt-app
```

Then added VueFire and firebase

```sh
npm i firebase vuefire nuxt-vuefire
```

> **Note**
> Replace `npm` with your favorite package manager

If you want to do SSR, you also need to install `firebase-admin` and create a service account JSON file. TODO: link

Setup a Firebase app at [Firebase Console](https://console.firebase.google.com/) and follow their instructions to get your Firebase config and set it in `main.ts`.

Use the `firebase-tools` package (`npm i -g firebase-tools`) to add the configuration to the project with:

```sh
firebase init
```

> **Info**
> You don't need to select everything you _might_ need, just select what you need **right now**, you can run the command again later to add new features.

The options selected were:

- Firestore
- Hosting

Make sure to change the `public` directory to `.output/public`. You don't need to worry about the hosting configuration as you will probably have to edit it manually anyway.
If you set up GitHub actions, **make sure the repository is created** before calling `firebase init`. If you misconfigure any step, that's fine you can call `firebase init` again and select only what you want to add to override existing settings.

## GitHub Workflows

The GitHub workflows you will find in this repository have been adapted from the generated ones to include a cache with pnpm.

## Firebase config

If you want to use this repository as a starter for your project, make sure to replace the different firebase files with your own or simply, run `firebase init` to override them. You will also need to update the config in `main.ts` with your own.
