from flask import Flask, jsonify

app = Flask(__name__)

@app.route('/predict', methods=['GET', 'POST'])
def predict():
    # DUMMY RESPONSE - Phase 1 only!
    return jsonify({
        "message": "Hello from the AI Service!",
        "prediction": "Apple",
        "confidence": 0.99
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)