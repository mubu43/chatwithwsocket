// Make connection
//because we loaded the cdn in our index.html, we have access to the io variable on client side
var socket = io.connect('http://localhost:4000');
//once the client makes the connection, the callback function on the server that awaits the connection fires(in this case simply a console log message)

//query dom

var message = document.getElementById('message');
var handle = document.getElementById('handle');
var btn = document.getElementById('send');
var output = document.getElementById('output');
var feedback = document.getElementById('feedback');

//emit event when send button is clicked

btn.addEventListener('click', function(){
    //emit a message down the web socket to the server
    //1st param for emit method is the name of the message(whart do we wanna call it) and second is the actual data that we wanna send
    socket.emit('chat', {
        //data entered by user and the handle name
        message: message.value,
        handle: handle.value
    });
    //handle this message on the server side
});

//listen for 'chat' event
socket.on('chat', function(data){
    //clear feedback(xyz is typing) when client clicks the send button
    feedback.innerHTML="";
    //when this socket client recieves the 'chat' message
    //output the message to the dom in the output div
    //concatenate so that messages recieved in the output div do not get overwrittrn
    output.innerHTML += '<p><strong>'+data.handle +':</strong>'+data.message+'</p>';

});

//listen for input eevent on the message input field so that we can broadcast a message to every other  client saying that 'xyz'(this client) is typing
message.addEventListener('keypress', function(){
    //emit an event called 'typing' and pass the name of the handle that is typing it
    //web sockets are open all the time and we interact with them in real-time
    socket.emit('typing', handle.value);
});

//on the front end, we wanna listen for the 'typing' event broadcasted by the server
socket.on('typing', function(data){
    feedback.innerHTML='<p><em>'+data+' is typing a message'+'</em></p>';
});