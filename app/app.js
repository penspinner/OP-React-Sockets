'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _socket = require('socket.io');

var _socket2 = _interopRequireDefault(_socket);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();
var socketIO = (0, _socket2.default)();

app.set('port', process.env.port || 4000);
app.use(_express2.default.static(__dirname + '/public'));
console.log(__dirname);

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

var server = app.listen(app.get('port'), function () {
    console.log('Listening on port: ' + app.get('port'));
});

socketIO.attach(server);
socketIO.on('connection', function (socket) {
    console.log('User connected.');

    /* Message was sent from a client, update chat on everyone's screen.*/
    socket.on('sendMessage', function (data) {
        console.log('send message');
        socketIO.emit('updateMessages', data);
    });

    // socket.on('getAllUsers', (data) =>
    // {
    //     console.log('get all users');
    //     socketIO.emit('getAllUsers', users);
    // });

    /* A user has connected, update everyone's screen. */
    socket.on('userConnected', function (data) {
        console.log(data.username + ' has connected.');
        socketIO.emit('userConnected', data);
    });

    /* A user has disconnected, update everyone's screen. */
    socket.on('userDisconnected', function (data) {
        console.log('onUserDisconnected');
        socketIO.emit('userDisconnected', data);
    });

    /* A user started typing, update everyone else's screen. */
    socket.on('userTyping', function (data) {
        console.log('user typing');
        socket.broadcast.emit('userTyping', data);
    });

    socket.on('disconnect', function () {
        console.log('User disconnected.');
    });
});