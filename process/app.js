import express from 'express';
import io from 'socket.io';
import React from 'react';
import ReactDOM from 'react-dom';

let app = express();
let socketIO = io();

app.set('port', process.env.port || 4000);
app.use(express.static(__dirname + '/public'));
console.log(__dirname);

app.get('/', (req, res) =>
{
    res.sendFile(__dirname + '/index.html');
});

let server = app.listen(app.get('port'), () =>
{
    console.log('Listening on port: ' + app.get('port'));
});


socketIO.attach(server);
socketIO.on('connection', (socket) =>
{
    console.log('User connected.');

    /* Message was sent from a client, update chat on everyone's screen.*/
    socket.on('sendMessage', (data) =>
    {
        console.log('send message');
        socketIO.emit('updateMessages', data);
    });

    // socket.on('getAllUsers', (data) =>
    // {
    //     console.log('get all users');
    //     socketIO.emit('getAllUsers', users);
    // });

    /* A user has connected, update everyone's screen. */
    socket.on('userConnected', (data) =>
    {
        console.log(data.username + ' has connected.');
        socketIO.emit('userConnected', data);
    });

    /* A user has disconnected, update everyone's screen. */
    socket.on('userDisconnected', (data) =>
    {
        console.log('onUserDisconnected');
        socketIO.emit('userDisconnected', data);
    });

    /* A user started typing, update everyone else's screen. */
    socket.on('userTyping', (data) =>
    {
        console.log('user typing');
        socket.broadcast.emit('userTyping', data);
    });


    socket.on('disconnect', () => 
    {
        console.log('User disconnected.');
    })
});