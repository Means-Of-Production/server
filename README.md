# server

## Development notes
so far - https://www.howtographql.com/typescript-apollo/1-getting-started/

### Build instructions

To build locally:
```
npm install
npm run compile
node ./dist/index.js
```

To run via docker:
```
docker build . -t mopserver
docker run mopserver
```

Both should be visible at `http://localhost:4000`
