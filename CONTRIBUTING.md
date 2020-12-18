## Start Dev server

### 1. Start the Firebase emulators

In a terminal window, run:

```sh
npm run start:emulators
```

### 2. Start the web app

Open a new terminal window, run:

```sh
npm start
```

This will open a browser window for the app. Note that the emulator command above will also serve the app on port 4000, but this is based on the static build in the `build` folder. The server on port 3000 is from `react-scripts` and will update based on code in `src`, and does not need to be built on every change.

## Testing

To run all tests:

```sh
npm test
```

To run frontend tests in watch mode (tests will re-run when you edit code):

```sh
npm run test:frontend
```

## Deploy to firebase

In a terminal window, run:

```sh
npm run deploy
```
