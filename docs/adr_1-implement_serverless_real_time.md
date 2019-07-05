# Implement serverless real time

* Status: proposed
* Deciders: MaximeT, BenjaminG, NicolasB, LoicC, AxelB, CorentinD
* Date: 05-07-2019


## Context and Problem Statement

We want to migrate the backend of a website to a serverless architecture with AWS Lambdas. 
Even if it looks more complex than using a container with the node/graphQL server for example,
we chose to use serverless to be more familiar with this technology.

The website implements a realtime feature to keep all the instances of frontends of a user synchronized.

The current stack is :
* Frontend : React with Apollo Client.
* Backend : NestJs with Apollo Server as GraphQL module, Sequelize as ORM.
* DataBase : PostgreSQL.

Every layers are deployed on the same virtual machine on an openstack instance for now.

## Decision Drivers

* The frontend should send GraphQL queries and mutations to the backend.
* The Authentication is based on JWT Token, issued by the backend 
after a first authentication provided by the API of Trello.
* The frontend should receive real time updates only for the connected user's data.
* User A MUST NOT access user B's data.
* The backend MUST send real time updates to the connected client immediately.

## Considered Options

### 1. MQTT Broker (AWS IoT)

**Pro:**

* Functional broker out of the box able to communicate with a web client.
* Simple to understand.

**Cons:**

* The frontend authentication is only optimized for Cognito and
 [custom authorizer does not work with web client](https://github.com/aws/aws-iot-device-sdk-js/issues/169).
The work around consist in requesting temporary credentials with custom policy to STS through
the backend every hour &rarr; The simplicity of use is KO.   
* It is a an IoT protocol, it seems not made for this kind of problem.

**Schema:**

![MQTT schema](Schema_serverless_pubsub_mqtt.png)

### 2. AWS AppSync

**Pro:**

* Serverless solution designed to build real time web app with GraphQl.
* Easy to use: providing GraphQl schema and resolver templates is enough to generate 
an available GraphQL endpoint which support GraphQL subscription.
* Complex use case could be dealt with custom lambda resolvers.

**Cons:** 

* The authorization types handle by AppSync are : API_KEY, AWS_IAM, OPENID_CONNECT and
 AMAZON_COGNITO_USER_POOLS.
 [There is no proper way to implement custom authorizers](https://github.com/aws/aws-appsync-community/issues/2). 
 The work around is to create a pipeline of resolvers where the first resolvers is a lambda 
 which check the authentication &rarr; Hard to implement our Trello based authentication.
* Too much refactor : using AppSync require to build an other backend from scratch. 
There are few pieces of code which could be kept.

**Schema:**

![AppSync schema](appsync_schema.png)

### 3. Custom broker of Michalkvasnicak

Use the package [aws-lambda-graphql](https://github.com/michalkvasnicak/aws-lambda-graphql).
**Pro:** 

* Solution designed to migrate our stack to AWS serverless :
 The package is developed to setup a PubSub solution for subscriptions in GraphQL.
* Seems to be the serverless way to implement real time, the solution is only made of serverless basic
 components : Api GateWay, lambdas and dynamoDb.

**Cons:** 

* Performances : latency between the mutation request and the reception of the subscribed message
* Complex architecture &rarr; hard to understand, debug and maintain.

**Schemas:**

![my schema of Michalkvasnicak solution](my_schema_of_Michalkvasnicak_solution.jpg)

![Michalkvasnicak schema](michalkvasnicak_schema.svg)

### 4. Develop our own custom broker from the solution 3 with SNS

Start from the [aws-lambda-graphql](https://github.com/michalkvasnicak/aws-lambda-graphql), 
use SNS enable inter-lambda communication instead of DynamoDB stream

**Pro:** 

* It allows us to tailor-make a solution matching all the decision drivers.
* Seems to be the serverless way to implement real time, the solution is only made of serverless basic
 components : Api GateWay, lambdas, dynamoDb and SNS.

**Cons:** 

* Impossible to secure : RDS cannot be outside of a VPC, SNS and DynamoDb cannot be in a VPC, lambda could be either in VPC or not.
    * If the lambdas are outside a VPC, the RDS should be public &rarr; KO security
    * If the lambdas are inside a VPC, they could not subscribe to SNS &rarr; KO architecture
* Complex architecture &rarr; hard to understand, debug and maintain.
 
**Schema:** 
 
 ![SNS_pubsub_serverless_schema](SNS_pubsub_serverless.png)

 ### 5. Serverless components : realtime-app
 
 Use the package [serverless-components/realtime-app/](https://github.com/serverless-components/realtime-app/).
 It's a Component of [Serverless Components](https://github.com/serverless/components).
 
 The pitch of Serverless Components :
 >It's a framework for provisioning and composing cloud services into higher-level abstractions,
  like features and applications. 
  It depends on external Components, which are javascript libraries that can provision something,
  like infrastructure or a whole software feature built on multiple pieces of infrastructure. 
 
 It's an overlay of the framework [Serverless](https://serverless.com/). 
 
 **Pro:** 
 
 * Solution designed to implement real time in serverless.
 * It implements [Serverless components](https://github.com/serverless/components) which make 
 the solution easy to deploy : a une command to create the AWS infrastructure (if it does not exist) 
 and deploy new code on it.
 
 **Cons:** 
 * No mention of offline development.
 * Only use websockets to communicate with the client &rarr; we can't use the Apollo Server of 
 our current backend which use http to deal with queries and mutations.
 * There is no docs and probably some bugs : when I tested the package, there is a functionality
  I didn't manage to use, I don't know if I badly used the package or if it's a bug.
  
  ### 6. Publish to Subscribers in the GraphQL resolver
  
  It is not possible to use SNS and painful to use DynamoDB (need to add a specific endpoint) with VPC. 
  But a VCP is mandatory with a RDS, so this solution store the subscriptions in the RDS 
  (instead of a DynamoDB comparing to solutions 3. and 4.) and send back the messages to the subscribers in 
  the same lambda as the mutations are processed.   
  
  **Pro:** 
  
  * It allows us to tailor-make a solution matching all the decision drivers.
  * Perf will be better than with solution 4. because there are no more communication between two lambdas 
  before send back the messages to the API
  
  **Cons:** 
  
  * The GraphQl lambda has several purpose which is not recommended ([cf Paul Johnson best practise](https://medium.com/@PaulDJohnston/serverless-best-practices-b3c97d551535))
  * Complex architecture &rarr; hard to understand, debug and maintain.
   
  **Schema:** 
   
   ![GraphQl_real_time_serverless_schema](GraphQl_real_time_serverless.png)

## Decision Outcome

Chosen option: "6. Publish to Subscribers in the GraphQL resolver", because:
* With the solution 1 and 2, we can't easily implement the Trello based authentication.
* Solution 3 have performances issues.
* Solution 4 have security issues.
* Solution 5 is incompatible with our current Backend. 
