const AWS = require('aws-sdk')
const express = require('express')
const bodyParser = require('body-parser')
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')

AWS.config.update({ region: process.env.TABLE_REGION });

const dynamodb = new AWS.DynamoDB.DocumentClient();
let booksTableName = "BooksTable";

if (process.env.ENV && process.env.ENV !== "NONE") {
	booksTableName = booksTableName + '-' + process.env.ENV;
}

const app = express()
app.use(bodyParser.json())
app.use(awsServerlessExpressMiddleware.eventContext())
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "*")
  next()
});

// booksLambda route handler: fetching books
app.get("/books", function (request, response) {
  console.log("Starting GET: Books from " + booksTableName);
  let params = {
    TableName: booksTableName,
    limit: 100
  }
  dynamodb.scan(params, (error, result) => {
    if (error) {
      console.log("Error getting Books");
      response.json({ statusCode: 500, error: error.message });
    } else {
      console.log("Getting Books ok");
      response.json({ statusCode: 200, url: request.url, body: JSON.stringify(result.Items) })
    }
  });
});

// booksLambda route handler: fetching a book by id
app.get("/books/:id", function (request, response) {
  console.log("Starting GET: Books from " + booksTableName + " by id " + request.params.id);
  let params = {
    TableName: booksTableName,
    Key: {
      id: request.params.id
    }
  }
  dynamodb.get(params, (error, result) => {
    if (error) {
      response.json({ statusCode: 500, error: error.message });
    } else {
      response.json({ statusCode: 200, url: request.url, body: JSON.stringify(result.Item) })
    }
  });
});

// booksLambda route handler: creating a new book
app.post("/books", function (request, response) {
  let bookParams = {
    TableName: booksTableName,
    Item: {
      'id' : request.body.id,
      'author' : request.body.author,
      'title' : request.body.title,
      'gender' : request.body.gender,
      'releaseDate' : request.body.releaseDate,
    }
  }

  dynamodb.put(bookParams, (error, result) => {
    if (error) {
      response.json({ statusCode: 500, error: error.message, url: request.url });
    } else {
      response.json({ statusCode: 200, url: request.url, body: JSON.stringify(result.Item) })
    }
  });
});

// booksLambda route handler: updating a book
app.put("/books", function (request, response) {
  const params = {
    TableName: booksTableName,
    Key: {
      id: request.body.id,
    },
    ExpressionAttributeNames: { '#text': 'text' },
    ExpressionAttributeValues: {},
    ReturnValues: 'UPDATED_NEW',
  };
  params.UpdateExpression = 'SET ';
  if (request.body.title) {
    params.ExpressionAttributeValues[':title'] = request.body.title;
    params.UpdateExpression += '#title = :title, ';
  }
  if (request.body.description) {
    params.ExpressionAttributeValues[':description'] = request.body.description;
    params.UpdateExpression += '#description = :description, ';
  }
  if (request.body.author) {
    params.ExpressionAttributeValues[':author'] = request.body.author;
    params.UpdateExpression += '#author = :author, ';
  }

  dynamodb.update(params, (error, result) => {
    if (error) {
      response.json({ statusCode: 500, error: error.message, url: request.url });
    } else {
      response.json({ statusCode: 200, url: request.url, body: JSON.stringify(result.Attributes) })
    }
  });
});

// booksLambda route handler: deleting a book by id
app.delete("/books/:id", function (request, response) {
  let params = {
    TableName: booksTableName,
    Key: {
      id: request.params.id
    }
  }
  dynamodb.delete(params, (error, result) => {
    if (error) {
      response.json({ statusCode: 500, error: error.message, url: request.url });
    } else {
      response.json({ statusCode: 200, url: request.url, body: JSON.stringify(result) })
    }
  });
});

app.listen(3000, function() {
  console.log("App started")
});

module.exports = app