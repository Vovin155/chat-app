document.addEventListener('DOMContentLoaded', () => {
    const socket = io();
    const form = document.getElementById('form');
    const input = document.getElementById('input');
    const messages = document.getElementById('messages');
    const understoodButton = document.getElementById('understoodButton');
    const isHost = window.location.hostname === "simplichat-4574e9445db1.herokuapp.com";

    if (isHost) {
        form.style.display = 'block';
        input.hidden = false;
        form.querySelector('button').hidden = false;
    } else {
        form.style.display = 'none';
        understoodButton.style.display = 'block';
    }

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        if (input.value) {
            socket.emit('chat message', input.value);
            // Directly add the message as 'sent' by host to avoid duplication
            if (isHost) {
                createMessageElement(input.value, 'You');
                maintainThreeMessages(); // Ensure only three messages are displayed for the host as well
            }
            input.value = '';
        }
    });

    socket.on('chat message', function(msg) {
        if (!isHost) {
            createMessageElement(msg, '');
            maintainThreeMessages(); // Ensure only three messages are displayed
        }
    });

    socket.on('message read', function() {
        Array.from(messages.children).forEach(child => {
            child.classList.add('message-read'); // Apply CSS class to all messages
        });
    });

    understoodButton.addEventListener('click', function() {
        socket.emit('message read');
    });

    function createMessageElement(msg, sender) {
        var item = document.createElement('div');
        item.textContent = msg;
        item.className = 'message';
        messages.appendChild(item);
    }

    function maintainThreeMessages() {
        while (messages.children.length > 3) {
            messages.removeChild(messages.firstChild); // Remove the oldest message
        }
    }
});
