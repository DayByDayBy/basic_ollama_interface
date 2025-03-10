document.addEventListener('DOMContentLoaded', () => {
    const chatBox = document.getElementById('chat-box');
    const messageInput = document.getElementById('message-input');
    const sendButton = document.getElementById('send-button');
    const startButton = document.getElementById('start-button');
    const saveButton = document.getElementById('save-button');
    const savedChatsList = document.getElementById('saved-chats-list');
    const modelSelect = document.getElementById('model-select');

    let messages = [];
    let currentModel = 'llama3';
    let conversationActive = false;

    // Fetch available models and populate the select dropdown
    fetch('/models')
        .then(response => response.json())
        .then(models => {
            models.forEach(model => {
                const option = document.createElement('option');
                option.value = model;
                option.textContent = model;
                modelSelect.appendChild(option);
            });
        });

    startButton.addEventListener('click', () => {
        if (!conversationActive) {
            currentModel = modelSelect.value;
            messages = [];
            chatBox.innerHTML = '';
            conversationActive = true;
            alert('New conversation started with model: ' + currentModel);
        }
    });

    sendButton.addEventListener('click', () => {
        if (conversationActive) {
            const userMessage = messageInput.value;
            if (userMessage.trim() === '') return;

            messages.push({ role: 'user', content: userMessage });
            displayMessage('user', userMessage);
            messageInput.value = '';

            fetch('/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ messages })
            })
            .then(response => response.json())
            .then(data => {
                const modelMessage = data.message.content;
                messages.push({ role: 'model', content: modelMessage });
                displayMessage('model', modelMessage);
            });
        } else {
            alert('Please start a new conversation first.');
        }
    });

    saveButton.addEventListener('click', () => {
        if (conversationActive && messages.length > 0) {
            const firstMessage = messages[0].content.substring(0, 20);
            const li = document.createElement('li');
            li.textContent = `Model: ${currentModel}, Message: ${firstMessage}`;
            savedChatsList.appendChild(li);

            // Save the conversation to the database
            fetch('/save_conversation', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ model: currentModel, messages })
            });

            conversationActive = false;
            messages = [];
            chatBox.innerHTML = '';
        } else {
            alert('No active conversation to save.');
        }
    });

    function displayMessage(role, content) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add(role);
        messageDiv.textContent = content;
        chatBox.appendChild(messageDiv);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    // Load saved conversations
    fetch('/load_conversations')
        .then(response => response.json())
        .then(conversations => {
            conversations.forEach(convo => {
                const li = document.createElement('li');
                li.textContent = `Model: ${convo[1]}, Message: ${JSON.parse(convo[2])[0].content.substring(0, 20)}`;
                savedChatsList.appendChild(li);
            });
        });
});
