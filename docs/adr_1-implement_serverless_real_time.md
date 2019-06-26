# Implement serverless real time

* Status: proposed
* Deciders: MaximeT, NicolasB, LoicC, AxelB, CorentinD
* Date: 26-06-2019


## Context and Problem Statement

We want to migrate the backend of a website to AWS serverless. We want use serverless to be more familiar with this technology.

The website implements a realtime feature to keep all the instances of frontends of a user synchronized.

The current stack is :
* Frontend : React with Apollo Client
* Backend : NestJs with its GraphQl module which use Apollo Server. The ORM is Sequelize
* DataBase : Postgres

## Decision Drivers

* The frontend should send GraphQl requests to get or mutate entities from the DB.
* The authentication route is custom and use a JWT to check the identity after.
* The frontend should be able to subscribe to the topics of its user.
* The frontend should not be able to subscribe to the topics of other users.
* The publications in topics are made by the backend after some migrations.
* The message should be received by the subscribers just after the migration request is made without perceptible latency.

## Considered Options

### 1. MQTT Broker (AWS IoT)
* Pro : 

Functional broker out the box which could communicate with web client.

Simple to understand.

* Cons : 

The authentication is optimized for Cognito and [custom authorizer does not work with web client](https://github.com/aws/aws-iot-device-sdk-js/issues/169).

&rarr; Hard to implement our authentication

* Schema :

![MQTT schema](Schema_serverless_pubsub_mqtt.png)

### 2. AWS AppSync

* Pro : 

Serverless solution designed to build real time web app with GraphQl.

Simple to use.

* Cons : 

Should (must) be used with Cognito. [Very hard to implement custom authorizers](https://github.com/aws/aws-appsync-community/issues/2).

&rarr; Very hard to implement our authentication

* Schema :

![AppSync schema](appsync_schema.png)

### 3. Custom broker of Michalkvasnicak

Use the package [aws-lambda-graphql](https://github.com/michalkvasnicak/aws-lambda-graphql)
* Pro : 

Solution designed to use GraphQl PubSub in serverless.

Seems to be the serverless way to implement real time.

* Cons : 

Performances : latency between the mutation request and the reception of the subscribed message

Complicate schema &rarr; hard to understand.

* Schemas :

![my schema of Michalkvasnicak solution](my_schema_of_Michalkvasnicak_solution.jpg)

![Michalkvasnicak schema](michalkvasnicak_schema.svg)

### 4. Develop our own custom broker from the solution 3

Start from the [aws-lambda-graphql](https://github.com/michalkvasnicak/aws-lambda-graphql), remove unnecessary things and try to improve the performances. 

* Pro : 

Able us to completely custom the solution to match all the decisions drivers.

Seems to be the serverless way to implement real time.

* Cons : 

Long to develop

No certainty about the results

Complicate schema &rarr; hard to understand.
 
 Schema : 
 
 current schema
 ![custom brocker schema](DynamoDb_pubsub_serverless.png)

## Decision Outcome

Chosen option: "4. Develop our own custom broker from the solution 3", because the three first options lead us to dead ends.
