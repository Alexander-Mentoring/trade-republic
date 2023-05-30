## Demo

<video src="./documentation/demo.mp4"></video>

## How to run

`yarn install` - to install dependencies

`yarn dev` - to start project in dev mode

`yarn storybook` - to open UI components library

`yarn test` - to run unit tests

## File structure

/src/components/ - folder with shared components

`<NameOfComponent>.tsx` - component file

`<NameOfComponent>.stories.tsx` - storybook file

`<NameOfComponent>.css` - styles file

/pages - folders with pages sepcific components

`<NameOfPage>.tsx` - file of page

`<NameOfPage>.css` - file of page styles

`<NameOfPage>/components` - page specific components

`<NameOfPage>/translations` - page translations

`<NameOfPage>/__tests__` - page tests

## Used libraries

### Runtime dependencies

`React` - framework that i most familiar with and will spend less time to solve task

`react-use-websocket` - library which handles work with websockets. Desided to use it, because it already handles reconnection cases from the box. But not sure that i would like to use it in production. Maintianer not answers in issue. Possibly would like to find something better.

`state-manager` - did not find any complex logic in this project, then have been using just react useState

### Dev dependencies

`storybook` - provides good documentation for UI components and in the future can be usefull for UI testing

`jest` - test runner. Have choosed it beacause have a lot experiance with this library and it worked well for me

`react-testing-library` - library which helps test react components. Provides good testing patterns. Works well for me

`eslint/prettier` - to make consistent code

## Answers on questions

> 1. What happens in case the WebSocket disconnects? How would you go further to keep
>    the live data available or inform the user? Please discuss the challenges.

In case of disconnection we have different options to handle it:

1. Try to reconnect
2. Inform user about issues with the servier
3. Store data in offline storage and then sync it

We can use one of this technics or use them all together. It depence on the case that we would like handle and the data which we would like to store.

Possible challanges:

1. Incostistend state between frontend and backend
2. With reconnection we can ddoss our server. It is important increase timeout between reconnection requests

> 2. What happens if a user adds an instrument multiple times to their list? Please discuss possible challenges and mitigations.

1. We will have a lot of DOM nodes which will updates in the same time. Then we will have performance issues.
2. It may confuse user

> 3. What potential performance issues might you face when this app scales with multiple subscriptions? How would you improve the speed and user experience?

1. With a large number of subscriptions, the network bandwidth usage can increase significantly. Network congestion can result in slower data transmission, delayed updates, and potential packet loss, negatively affecting the user experience.

How to fix:

    1. Compress data
    2. Minimize the size of the transmitted data by sending only necessary information. Avoid sending redundant or unnecessary data fields to reduce bandwidth consumption.

2. Rendering and updating a large number of live data can impact performance and responsiveness, especially on devices with limited processing power.

How to fix:

    1. Use virtual scrolls
    2. Pagination
