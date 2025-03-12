document.addEventListener("DOMContentLoaded", () => {
  const chatBox = document.getElementById("chat-box");
  const messageInput = document.getElementById("message-input");
  const sendButton = document.getElementById("send-button");
  const startButton = document.getElementById("start-button");
  const saveButton = document.getElementById("save-button");
  const newChatButton = document.getElementById("new-chat-button");
  const savedChatsList = document.getElementById("saved-chats-list");
  const modelSelect = document.getElementById("model-select");
  const modelSelectionArea = document.getElementById("model-selection-area");
  const currentModelIndicator = document.getElementById(
    "current-model-indicator"
  );
  const modelInfo = document.getElementById("model-info");

  let messages = [];
  let currentModel = "";
  let conversationActive = false;

  // fetch available models and populate the select dropdown
  fetch("/models")
    .then((response) => response.json())
    .then((models) => {
      models.forEach((model) => {
        const option = document.createElement("option");
        option.value = model;
        option.textContent = model;
        modelSelect.appendChild(option);
      });
    });

  // start conversation with selected model
  startButton.addEventListener("click", () => {
    if (modelSelect.value === "") {
      alert("Please select a model first");
      return;
    }

    currentModel = modelSelect.value;
    messages = [];

    // update UI for active conversation
    modelSelectionArea.style.display = "none";
    chatBox.style.display = "flex";
    messageInput.style.display = "block";
    sendButton.style.display = "inline-block";
    saveButton.style.display = "inline-block";
    newChatButton.style.display = "inline-block";

    // show current model indicator
    currentModelIndicator.textContent = `Currently chatting with: ${currentModel}`;
    currentModelIndicator.style.display = "block";

    // update model info section
    modelInfo.innerHTML = `
            <div class="model-card">
                <div class="model-name">${currentModel}</div>
                <div class="model-info">Active conversation</div>
            </div>
        `;

    conversationActive = true;
  });

  // send message
  sendButton.addEventListener("click", sendMessage);
  messageInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendMessage();
  });

  function sendMessage() {
    const userMessage = messageInput.value;
    if (userMessage.trim() === "") return;

    messages.push({ role: "user", content: userMessage });
    displayMessage("user", userMessage);
    messageInput.value = "";

    fetch("/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ messages }),
    })
      .then((response) => response.json())
      .then((data) => {
        const modelMessage = data.message.content;
        messages.push({ role: "model", content: modelMessage });
        displayMessage("model", modelMessage);
      });
  }

  // save conversation
  saveButton.addEventListener("click", () => {
    if (conversationActive && messages.length > 0) {
      const firstMessage =
        messages[0].content.substring(0, 20) +
        (messages[0].content.length > 20 ? "..." : "");
      const timestamp = new Date().toLocaleString();
      const li = document.createElement("li");
      li.textContent = `${timestamp} - ${currentModel}: ${firstMessage}`;
      savedChatsList.appendChild(li);

      // save the conversation to the database
      fetch("/save_conversation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ model: currentModel, messages }),
      });

      resetChat();
    } else {
      alert("No active conversation to save.");
    }
  });

  // start new chat
  newChatButton.addEventListener("click", () => {
    resetChat();
  });

  function resetChat() {
    conversationActive = false;
    messages = [];

    // reset UI
    chatBox.innerHTML = "";
    chatBox.style.display = "none";
    messageInput.style.display = "none";
    sendButton.style.display = "none";
    saveButton.style.display = "none";
    newChatButton.style.display = "none";
    currentModelIndicator.style.display = "none";

    modelSelectionArea.style.display = "flex";
    modelSelect.selectedIndex = 0;
  }

  function displayMessage(role, content) {
    const messageDiv = document.createElement("div");
    messageDiv.classList.add(role);

    // handle code blocks in messages
    if (content.includes("```")) {
      const parts = content.split(/```(?:\w+)?\n?/);
      let formattedContent = "";

      for (let i = 0; i < parts.length; i++) {
        if (i % 2 === 0) {
          // regular text - convert newlines to <br>
          formattedContent += parts[i].replace(/\n/g, "<br>");
        } else {
          // code block
          formattedContent += `<pre><code>${parts[i]}</code></pre>`;
        }
      }
      messageDiv.innerHTML = formattedContent;
    } else {
      // convert newlines to <br> for regular messages
      messageDiv.innerHTML = content.replace(/\n/g, "<br>");
    }

    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
  }

  // load saved conversations
  fetch("/load_conversations")
    .then((response) => response.json())
    .then((conversations) => {
      conversations.forEach((convo) => {
        const timestamp = new Date().toLocaleString(); // In a real app, this would come from the DB
        const model = convo[1];
        const firstMessage =
          JSON.parse(convo[2])[0].content.substring(0, 20) + "...";

        const li = document.createElement("li");
        li.textContent = `${timestamp} - ${model}: ${firstMessage}`;
        li.dataset.id = convo[0]; // Store the conversation ID
        savedChatsList.appendChild(li);

        // add click event to load conversation
        li.addEventListener("click", () =>
          loadConversation(convo[0], model, JSON.parse(convo[2]))
        );
      });
    });

  function loadConversation(id, model, messages) {
    // set current model and messages
    currentModel = model;
    window.messages = messages; // Use the loaded messages

    // update UI for active conversation
    modelSelectionArea.style.display = "none";
    chatBox.style.display = "flex";
    chatBox.innerHTML = ""; // Clear chat box
    messageInput.style.display = "block";
    sendButton.style.display = "inline-block";
    saveButton.style.display = "inline-block";
    newChatButton.style.display = "inline-block";

    // show current model indicator
    currentModelIndicator.textContent = `Currently chatting with: ${currentModel}`;
    currentModelIndicator.style.display = "block";

    // display messages
    messages.forEach((msg) => {
      displayMessage(msg.role, msg.content);
    });

    conversationActive = true;
  }
});
