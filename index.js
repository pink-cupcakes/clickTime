const express = require('express');
//axios provides a shorthand to promisifying AJAX calls
const axios   = require('axios');
const fs      = require('fs');

const app = express();

app.get('/', (req, res) => {
  //Processing objects from API for writing to file
  const processObj = (obj) => {
    obj = JSON.stringify(obj).slice(1, -1);
    obj = obj.replace(/\"/g, "");
    obj = obj.split(',');
    let result = '';
    obj.forEach((pair) => {
      result = result.concat("|", pair, "|");
    });
    return result;
  };

  //Format date
  let date = new Date();
  date = date.getMonth() + 1 + "-" + date.getDate() + "-" + date.getFullYear()

  axios.get('https://bitbucket.org/clicktime/clicktime-public/raw/b17ff44ae338c7a7fc4ecd47e56a6974f49a62a8/Sample_ClickTime_Data.json')
    .then((res) => {
      //result array from API
      let contractArr = res.data.data;

      //create file if it doesn't exist, if it does, replace the contents
      let filePath = date.concat('.csv');
      fs.writeFile(filePath, (err) => { throw err; });

      //edit the empty file created above. writeStream allows us to handle calls from larger APIs by handling data in chunks
      const file = fs.createWriteStream(filePath);
      file.on('error', (err) => { throw err; });

      contractArr.forEach((contract) => {
        let processedObj = processObj(contract);
        file.write(processedObj + '\n');
      });
      file.end();
    })
    .catch((err) => {
      throw err;
    })
}) 

let server = app.listen(5000, function() {
  let port = server.address().port;
  console.log('Listening to port ', port);
});