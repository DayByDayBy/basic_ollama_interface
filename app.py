from flask import Flask, request, jsonify, render_template
import ollama
import sqlite3

app = Flask(__name__)

# Initialize the Ollama model
model = 'llama3'

# Database setup
def init_db():
    conn = sqlite3.connect('conversations.db')
    c = conn.cursor()
    c.execute('''
        CREATE TABLE IF NOT EXISTS conversations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            model TEXT,
            messages TEXT
        )
    ''')
    conn.commit()
    conn.close()

init_db()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/chat', methods=['POST'])
def chat():
    global model
    data = request.json
    messages = data.get('messages', [])
    response = ollama.chat(model=model, messages=messages)
    return jsonify(response)

@app.route('/models', methods=['GET'])
def models():
    # For now, return a preset list of models
    return jsonify(['llama3', 'llama3.1', 'llama3.2'])

@app.route('/save_conversation', methods=['POST'])
def save_conversation():
    data = request.json
    model = data.get('model')
    messages = data.get('messages', [])
    conn = sqlite3.connect('conversations.db')
    c = conn.cursor()
    c.execute('''
        INSERT INTO conversations (model, messages)
        VALUES (?, ?)
    ''', (model, str(messages)))
    conn.commit()
    conn.close()
    return jsonify({'status': 'success'})

@app.route('/load_conversations', methods=['GET'])
def load_conversations():
    conn = sqlite3.connect('conversations.db')
    c = conn.cursor()
    c.execute('SELECT id, model, messages FROM conversations')
    conversations = c.fetchall()
    conn.close()
    return jsonify(conversations)

if __name__ == '__main__':
    app.run(debug=True)
