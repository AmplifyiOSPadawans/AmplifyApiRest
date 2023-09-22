/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/

/* Amplify Params - DO NOT EDIT
	AUTH_AMPLIFYAPIREST2B93704C_USERPOOLID
	ENV
	REGION
	STORAGE_AUTHORSTABLE_ARN
	STORAGE_AUTHORSTABLE_NAME
	STORAGE_AUTHORSTABLE_STREAMARN
	STORAGE_BOOKSTABLE_ARN
	STORAGE_BOOKSTABLE_NAME
	STORAGE_BOOKSTABLE_STREAMARN
Amplify Params - DO NOT EDIT */


const { v4: uuidv4 } = require('uuid');
const AWS = require('aws-sdk')

AWS.config.update({ region: process.env.TABLE_REGION });

const dynamodb = new AWS.DynamoDB.DocumentClient();
let authorsTableName = "AuthorsTable";

if (process.env.ENV && process.env.ENV !== "NONE") {
	authorsTableName = authorsTableName + '-' + process.env.ENV;
}

exports.handler = async (event, context) => {
  console.log(" EVENT: " + JSON.stringify(event, null, 2));
  console.log(" RECORDS: " + JSON.stringify(event.Records));
  console.log(" FIRST RECORD: " + JSON.stringify(event.Records[0]));

  if (event.Records.length > 0) {
    let record = event.Records[0].dynamodb

    console.log(' RECORD: %j', record);
	  console.log(' REGISTERED author: %j', record.NewImage.author.S);	
   
    let authorParams = {
      TableName: authorsTableName,
      Item: {
        'id' : uuidv4(),
        'author' : record.NewImage.author.S
      }
    }

    console.log(" OBJECT TO SAVE: " + JSON.stringify(authorParams));
  
    try {
      await dynamodb.put(authorParams).promise();
      console.log(" SAVED");

      return { body: 'Successfully created item!' }
    } catch (err) {
      console.log(" ERROR: " + err.errorMessage);
      return { error: err }
    }
  }
};
