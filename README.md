# Contract data parser
This is an API which will retrieve data from an endpoint with JSON data with the following structure:

  ```
    {
      "BillingRate": integer,
      "Comment": text,
      "CostRate": integer,
      "Date": string ("YYYY-MM-DD"),
      "Hours": integer,
      "ID": string,
      "IsBillable": boolean,
      "JobID": string,
      "TaskID": string,
      "UserID": string
    },
  ```

The API will output a .txt file. Currently it is saving it in the directory, but can be updated to include the file in the response. For an example file output, please see the included dailyexport_1806080823.txt file in the parent directory. Otherwise, follow the instructions in the next section.

# Getting started
Have the following installed:

- git version >= 2.7.1
- npm >= 5.6.0

Instructions:

1. Clone this repo:

   https://github.com/pinkwaffles/clickTime/

2. Run the following command:

  `npm install`

3. Then run:

  `npm run start`

The server is now running on localhost:5000 and will create a new file (or update an existing file if queried within a minute apart).