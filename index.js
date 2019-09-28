/*
websockets are a way for comunication between the client(a browser) and a server
this communication is bi directional which means that data can flow in both ways(client to server and server to client)
because these websockets are always open, that allows for real time data flow in our application

Uses of web sockets:-
multiplayer browser games
collaborative code editing etc.
*/


//basic express setup
var express = require('express');
var socket = require('socket.io');

var app = express();

var server = app.listen(4000, function(){
    console.log('listening to requests on port 4000!');
});

//static files
//middleware to serve files from public folder
app.use(express.static('public'));
//sockets.io will be installed on both client side and server side i e on both index.js and public/index.html. Done via command line with npm install socket.io
//afterwards reuire('socket.io')

//sovcket setup
//1st param->server to work with
var io=socket(server);
//io waits for a connection to be made
//once the connection is made fore a callback function
//the callback function takes as parameter the socket instance that makes the connection when we request the index file
//include sockets io cdn on the font end(index.js)
io.on('connection', function(socket){
    console.log('made socket connection',socket.id);

    //take care of a 'chat' message sent to the server by the client
    socket.on('chat', function(data){
        // data is the object sent by the client. in this case the message object with message and handle values
        //we now work with the data object.
        //what do we wanna do with the data that we have now?
        //we wanna send it to the all the clients in the chat room so that everyone in the chat room can see that message
        //when we say io.sockets it refers to all the client sockets in the chat room as a collection
        io.sockets.emit('chat', data);
        //this data gets sent to all the clients in the chat room
        //take care of the data object passed to the front end
    });

    //create another listener to listen to the 'typing' event
    socket.on('typing', function(data){
        //broadcast this message to every other client other than the one that emitted the 'typing' event
        //so we broadcast this 'typing' event to every other client and we also pass the data that the sending client sent us(his handle name)
        socket.broadcast.emit('typing', data);
    })
});



