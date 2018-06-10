const express = require('express');
const axios   = require('axios');
const fs      = require('fs');

const { processObj, generateFileDate } = require('./helpers.js');

const app = express();

app.get('/', (req, res) => {
  axios.get('https://bitbucket.org/clicktime/clicktime-public/raw/b17ff44ae338c7a7fc4ecd47e56a6974f49a62a8/Sample_ClickTime_Data.json')
    .then((res) => {
      let availableContractsArr = res.data.data;
      let filePath = generateFileDate();
      fs.writeFile(filePath, (err) => { return err ? err : null });

      /*WriteStream allows us to handle calls from larger APIs by handling the writing to the file in chunks*/
      const file = fs.createWriteStream(filePath);
      file.on('error', (err) => { throw err; });

      availableContractsArr.forEach((contract, index) => {
        let processedObj = processObj(contract);
        file.write(processedObj);
      });
      file.end();
    })
    .catch((err) => { throw err; });
}) 

let server = app.listen(5000, function() {
  let port = server.address().port;
  console.log('Listening to port ', port);
});