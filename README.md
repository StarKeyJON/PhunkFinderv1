You will need to enter in your Infura wss key into /src/components/PhunkDisplay/NLL/NLLPhunks.js in order to fetch the phunk marketplace contract.

The rest should be a standard CRA Install/Start operation to get going.
I'm currently working on a new build with a backend DB and frontend like this desing here.

This design currectly fetches fresh data from many api endpoints at every client connection, so I created a function to query all the necessary endpoints and update a mongo DB, server side, on a set timeframe. This will reduce the amount of api calls and also it gives specific http endpoints as some were requesting, and overall better handling of the data.

The NLL component needed work on how the data was fetched and sorted, because at the moment it is designed to fetch all phunks listed for sale events from the smart contract and then goes through a sorting function to seperate out repeats and old listings, but there needed to be an extra call to the contract to see if that Phunk is still listed for sale because old Phunks that weren't listed for sale anymore were showing up. This ended up in too many requests happening client side, and a overall need to redesign the whole thing and learn more.

I'm pretty happy with the progress so far.

Please feel free to take it apart and put it back together how you see fit! This has been a journey in creating and deploying my first website, hosted with digitalocean.

Happy Hacking!




# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can???t go back!**

If you aren???t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you???re on your own.

You don???t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn???t feel obligated to use this feature. However we understand that this tool wouldn???t be useful if you couldn???t customize it when you are ready for it.
