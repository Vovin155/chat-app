document.addEventListener('DOMContentLoaded', () => {
    const socket = io();
    const form = document.getElementById('form');
    const input = document.getElementById('input');
    const messages = document.getElementById('messages');
    const understoodButton = document.getElementById('understoodButton');
    const welcomeMessage = document.getElementById('welcomeMessage');
    const isHost = window.location.hostname === "simplichat-4574e9445db1.herokuapp.com";

    if (isHost) {
        form.style.display = 'block';
        input.hidden = false;
        form.querySelector('button').hidden = false;
    } else {
        form.style.display = 'none';
        understoodButton.style.opacity = '1';
        understoodButton.style.visibility = 'visible';
        understoodButton.style.display = 'block';
        welcomeMessage.style.display = 'block'; // Show the welcome message to the client
    }

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        if (input.value) {
            socket.emit('chat message', input.value);
            if (isHost) {
                createMessageElement(input.value, 'You');
                maintainOneMessage();
            }
            input.value = '';
        }
    });

    socket.on('chat message', function(msg) {
        if (!isHost) {
            createMessageElement(msg, '');
            maintainOneMessage();
            welcomeMessage.style.display = 'none'; // Hide the welcome message once a chat message is received
        }
    });

    understoodButton.addEventListener('click', function() {
        socket.emit('message read');
    });

    function createMessageElement(msg, sender) {
        while (messages.firstChild) {
            messages.removeChild(messages.firstChild);
        }

        var item = document.createElement('div');
        item.textContent = msg;
        item.className = 'message';
        messages.appendChild(item);
    }

    function maintainOneMessage() {
        while (messages.children.length > 1) {
            messages.removeChild(messages.firstChild);
        }
    }
});
