const express = require('express');
const axios   = require('axios');
const fs      = require('fs');

const app = express();

app.get('/', (req, res) => {

  /*Error handle if object key does not exist for standard input: UserID, JobID, TaskID*/
  const processValue = (obj, key, callback, last) => {
    let value = obj[key];
    if (!value) {
      return last ? '\n' : ' | ';
    } else if (last) {
      return callback ? callback(value).toString().concat('\n') : value.toString().concat(' | ');
    } else if (callback) {
      return callback(value).toString().concat(' | ');
    } else {
      return value.toString().concat(' | ');
    }
  };

  /*Date: Date format in data needs to reflect YYMMDD format. Per client request*/
  const processDate = (str) => {
    let date = new Date(str);
    let processedDate = "".concat(date.getUTCFullYear().toString().slice(-2));
    processedDate = processedDate.concat(('0'.concat(date.getUTCMonth() + 1)).slice(-2));
    processedDate = processedDate.concat(('0'.concat(date.getUTCDate())).slice(-2));
    return processedDate;
  };

  /*Hours and Billing rate: Fix two decimal places. Per client request*/
  const processNumber = (num) => {
    return num.toFixed(2);
  };
  
  /*Comments: Replace any delimiters in data (pipe delimiter only occurs in comments). Per client request
    
  This additional step is necessary as the client cannot process quotations in data. Standard practice
  is to parse by quotations and delimiter, and treat values inside quote as data.*/
  const processComment = (str) => {
    /*Assumption: client can parse escaped pipe-delimiter, however, can always replace '\\|' with '-' or another character*/
    return str.replace(/\|/g, '\\|');
  };

  /*This function will process the object per client requests/restrictions*/
  const processObj = (obj) => {
    let res = '';

    res = res.concat(processValue(obj, 'Date', processDate));
    res = res.concat(processValue(obj, 'UserID'));
    res = res.concat(processValue(obj, 'JobID'));
    res = res.concat(processValue(obj, 'TaskID'));
    res = res.concat(processValue(obj, 'Hours', processNumber));
    res = res.concat(processValue(obj, 'Comment', processComment));
    res = res.concat(processValue(obj, 'BillingRate', processNumber, true));

    return res;
  };

  /*Filename: files need to reflect dailyexport_YYMMDDhhmm.txt. Per client request*/
  let date = new Date();
  let fileDate = processDate(date);
  fileDate = fileDate.concat(('0'.concat(date.getHours())).slice(-2));
  fileDate = fileDate.concat(('0'.concat(date.getMinutes())).slice(-2));
  let filePath = "dailyexport_".concat(fileDate, '.txt');

  axios.get('https://bitbucket.org/clicktime/clicktime-public/raw/b17ff44ae338c7a7fc4ecd47e56a6974f49a62a8/Sample_ClickTime_Data.json')
    .then((res) => {
      let availableContractsArr = res.data.data;
      fs.writeFile(filePath, (err) => { return err ? err : null });

      /*WriteStream allows us to handle calls from larger APIs by handling the writing to the file in chunks*/
      const file = fs.createWriteStream(filePath);
      file.on('error', (err) => { throw err; });

      availableContractsArr.forEach((contract) => {
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