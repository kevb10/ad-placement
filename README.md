## Design overview
We can take advantage of the relationship between these files. I created a new record that keeps track of the costs and impressions for each placement. Ideally, this would actually be a new table or a new .csv file but for the sake of keeping it simple and printing it on the console, we're just gonna create a shallow copy of placement and add the additional info to it. 

## Language & framework of choice
- JavaScript: a language I am familiar with.
- Node.js: Allows you to get started with JS in a pretty straightforward manner.
- fast-csv: A library for parsing CSVs. 
- moment.js: Allows me to display, parse, manipulate date & time easily.
- eslint: Find and fix problems in my JS code.


## Getting started
- `yarn install`: Install dependencies.
- `yarn test`: Run tests.
- `node main`: Generate a report for all placements in our datastore.
- `node main M/D/YYYY-M/D/YYYY`: Generate a report for the given date range.