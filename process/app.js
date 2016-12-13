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

    socket.on('postMessage', (data) =>
    {
        socketIO.emit('updateMessages', data);
    });

    socket.on('disconnect', () => 
    {
        console.log('User disconnected.');
    })
});