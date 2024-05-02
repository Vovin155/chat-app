// chat.js
document.addEventListener('DOMContentLoaded', () => {
    var socket = io();
    var hostStatus = document.getElementById('hostStatus');
    var form = document.getElementById('form');
    var input = document.getElementById('input');
    var messages = document.getElementById('messages');
    var understoodButton = document.getElementById('understoodButton');

    // Display controls based on device width
    if (window.innerWidth >= 768) {  // Assuming host is on desktop
        hostStatus.style.display = 'block';  // Show the host status
        understoodButton.style.display = 'none';  // Hide understood button for host
    } else {
        form.style.display = 'none';  // Hide form for guest
        understoodButton.style.display = 'block';  // Show understood button for guest
    }

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        if (input.value) {
            socket.emit('chat message', input.value);
            input.value = '';
            createMessageElement(input.value, 'pending');  // Create pending message view
        }
    });

    socket.on('chat message', function(msg) {
        createMessageElement(msg, 'received');
        maintainThreeMessages(); // Ensure only three messages are displayed
    });

    socket.on('message read', function() {
        if (messages.lastChild) {
            messages.lastChild.style.backgroundColor = 'green'; // Highlight the last message
        }
    });

    understoodButton.addEventListener('click', function() {
        socket.emit('message read'); // Emit the message read event when understood is clicked
    });

    function createMessageElement(msg, status) {
        var item = document.createElement('li');
        item.textContent = msg;
        item.className = 'message ' + status;
        messages.appendChild(item);
    }

    function maintainThreeMessages() {
        while (messages.children.length > 3) {
            messages.removeChild(messages.firstChild); // Remove the oldest message
        }
    }
});
