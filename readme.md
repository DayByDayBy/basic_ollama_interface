# Ollama Chat Interface

this project is intended to provide a simple web-based interface to interact with local Ollama models. You can start conversations, select different models and save your chats for later reference.

## Features

- **Model Selection:** Choose from a list of available models to start a new conversation. (the list is in 'def models()' in app.py)
- **Chat Interface:** Send messages and receive responses from the selected model.
- **Save Conversations:** Save your current conversation and end it to start a new one.
- **Saved Chats:** View a list of saved conversations with their starting messages.

## Getting Started

### Prerequisites

- Python 3.11
- Flask
- Ollama
- SQLite (for saving conversations)

### Installation

1. **Clone the Repository:**
   ```sh
   git clone https://github.com/yourusername/ollama-chat-interface.git
   cd ollama-chat-interface
   ```

2. **Create a Virtual Environment (Optional but Recommended):**
   ```sh
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   ```

3. **Install Dependencies:**
   ```sh
   pip install Flask ollama
   ```

### Running the Application

1. **Start the Flask Server:**
   ```sh
   python app.py
   ```

2. **Open Your Browser:**
   Navigate to `http://127.0.0.1:5000/` to access the chat interface.

## Usage

1. **Select a Model:**
   - Choose a model from the dropdown menu.
   - Click the "Start Conversation" button to begin a new chat with the selected model.

2. **Send Messages:**
   - Type your message in the input box and click the "Send" button.
   - The model's response will appear in the chat box.

3. **Save/End Conversation:**
   - Click the "Save/End Conversation" button to save the current chat and end it.
   - The saved conversation will appear in the "Saved Chats" list.

## Project Structure

- `app.py`:  main Flask application file.
- `templates/index.html`: HTML template for the chat interface.
- `static/styles.css`: CSS styles for the interface.
- `static/script.js`: JavaScript for handling user interactions.
- `conversations.db`: SQLite database for saving conversations.

## Contributing

Feel free to contribute to this project by opening issues or submitting pull requests. Your feedback and improvements are welcome, and you may fork if you wish - nothing that clever is going on here, so feel free to build on it. Let me know if you do, I always like to see new code.


---

Enjoy chatting with your Ollama models! If you have any questions or need further assistance, feel free to reach out.