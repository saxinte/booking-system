# Train Booking System

This app provide a booking page. A person can book a train seat using this app. All seats are displayed in a carriage view. Seats datas are stored in the localStorage of the browser. As we don't have a real Database, I'm using the same localStorage key (e.g. 'CAR_SEATS'). This is for purpose only, to keep the app a bit closer to the reality.

- Each new train carriage can display 'n' seats, stored in the database.
- Seats per rows can be changed.
- It's IE9+ ready.
- It's responsive ready.
- Users can select a maximum of 5 seats or pick a seat directly from the carriage.

## How to install
- First, fork this repo on a local server.
- Then you will need to install all Node dependencies using `npm install`. (Tested with Node 4.1.1)
- Then hit the following command: `npm start`).
- This will start the build and open `index.html` in your browser.

## How to test (not ready, karma-browserify is missing)
- Tests should then run using `karma start`.
