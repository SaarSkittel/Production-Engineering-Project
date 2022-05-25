# Scalable Serving Project
## Introduction

An ongoing project where I created a full-blown ecosystem that runs on Docker with a friendly UI, dynamic http serving backend written in NodeJS (express) with two Nginx LoadBalancers.
The project utilizes MySQL for user data, JWT, Graphite and Grafana to monitor the collect, store and analyze metrics from the services.
## Project Components
### Backend 
#### Servers
This project utilizes three identical Node.js servers to handle redundancy problems and it is using Express.js.
The servers functions as a REST API that handles http request from the Frontend.
Those request modify, create, collected and delete data from the MySQL Database.
##### Technologies used:
•	MySQL- the API request modify, create, collected and delete data from the MySQL Database server.

•	JWT- The requests that are sent to the server are authenticated by with both access token and refresh token to ensure fraud and identity theft. The access token is given to the user when he logs in it has an expiration time of an hour the user gets it in the response or when he request to refresh it when it is expired.
The refresh token is also given when the user logs in and it is stored in the cookies as an HttpOnly so the refresh token only visible to the server.
#### MySQL
The Database stores all of the users data.
#### Graphite
 Monitor the collect, store and analyze metrics from the services.  Gets all the status code reports, Database query times and user count made by the servers and shows them in graphs.
#### Grafana
Uses the data collected by graphite and give it a more pleasing UI representation.  
#### Nginx Load Blancers
To handle high availability the load balancer send the request to the servers using the round robin (no persistency).
### Frontend
The Frontend is written in React.js using MaterialUI and it send all the requests to the servers and shows data that came from the responses.

