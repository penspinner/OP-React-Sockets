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

    socket.on('postMessage', function (data) {
        socketIO.emit('updateMessages', data);
    });

    socket.on('disconnect', function () {
        console.log('User disconnected.');
    });
});