
var socket = io();
var chatMessages = document.getElementById('chatMessages');
var message = document.getElementById('message');

socket.on('connect', () =>
{
    var chatForm = document.forms.chatForm;

    if (chatForm)
    {
        chatForm.addEventListener('submit', (e) =>
        {
            e.preventDefault();
            socket.emit('postMessage', {})
        });

        socket.on('updateMessages', updateMessages);
    }

});
    
function updateMessages(data)
{
    console.log('update messages');
}