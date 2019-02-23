const fs = require('fs');
const express = require('express');
let data = {};

function readData() { 
  return new Promise((resolve) => {
    fs.readFile('./data.json', (err, data) => {
	resolve(parseData(data));
    });
  });
}

function parseData(rawData) {
  try {
    return JSON.parse(rawData);
  } catch (e) {
    console.log(e);
    return {error: 'parse exception'};
  }
}

function startServer() {
	const srv = express();

	srv.use(express.static('client'));
	srv.get('/item', (req, res) => res.json(data));

	srv.listen(8888);
}


function init() {
	readData()
		.then(loaded => data = loaded)
		.then(startServer);
}

init();
