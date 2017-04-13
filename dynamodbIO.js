"use strict";
const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient({region: "eu-west-1"});
var params;
 
exports.handler = (event, context, callback) => {
    var table_name = event.body.table_name;
     
    switch(event.body.instruction){
        case "scan":
            params = {
                TableName: table_name,
                Limit: 100
            };
             
            docClient.scan(params, function(err, data){
                if(err) callback(err, null);
                else callback(null, data);
            });
            break;
             
        case "get":
            params = {
                TableName: table_name,
                Key:{
                        "name" : event.body.user_name
                    }
            };
             
            docClient.get(params, function(err, data){
                if(err) callback(err, null);
                else callback(null, data);
            });
            break;
             
        case "put":
            params = {
                TableName: table_name,
                Item:{
                        "name": event.body.user_name,
                        "age": event.body.user_age
                    }
            };
         
            docClient.put(params, function(err, data){
                if(err) callback(err, null);
                else callback(null, "put success");
            });
             
            break;
             
        case "delete":
            params = {
                TableName: table_name,
                Key:{
                    "name": event.body.user_name
                }
            };
              
            docClient.delete(params, function(err, data){
                if(err) callback(err, null);
                else callback(null, "delete success");
            });
             
            break;
             
        case "deleteAll":
             
            params = {
                TableName: table_name,
                Limit: 100
            };
             
            docClient.scan(params, function(err, data){
                if(err) callback(err, null);
                else{
                  data.Items.forEach(function(item){
                      params = {
                          TableName: table_name,
                          Key:{
                              "name": item.user_name
                            }
                      };
                      docClient.delete(params, function(err, data){
                          if(err) callback(err, null);
                          else console.log("delete" + item.user_name);
                      });
                       
                   });
                } 
            });
            break;
             
             
        default:
            var errMessage = "ERR : " + event.body.instruction + " is not exist instruction";
            callback(errMessage, null);
    }
};