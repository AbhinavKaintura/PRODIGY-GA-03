import torch
from transformers import GPT2LMHeadModel, GPT2Tokenizer
import numpy as np
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Load pre-trained model and tokenizer
tokenizer = GPT2Tokenizer.from_pretrained('gpt2')
model = GPT2LMHeadModel.from_pretrained('gpt2')
model.eval()

def clean_prediction(pred):
    # Remove special tokens and clean up the prediction
    pred = pred.strip()
    if pred.startswith('Ġ'):  # Remove GPT2's special space character
        pred = pred[1:]
    # Remove any non-word characters from start and end
    while pred and not pred[0].isalnum():
        pred = pred[1:]
    while pred and not pred[-1].isalnum():
        pred = pred[:-1]
    return pred

def get_word_predictions(text, num_predictions=5):
    try:
        # If text is empty or just whitespace, return empty predictions
        if not text or text.isspace():
            return []

        # Encode the input text
        inputs = tokenizer.encode(text, return_tensors='pt', add_special_tokens=True)
        
        with torch.no_grad():
            # Get predictions
            outputs = model(inputs)
            predictions = outputs[0]
            
            # Get the predicted token probabilities for the last position
            next_token_logits = predictions[0, -1, :]
            
            # Apply temperature scaling
            temperature = 0.7
            next_token_logits = next_token_logits / temperature
            
            # Filter out special tokens and unwanted tokens
            for id in tokenizer.all_special_ids:
                next_token_logits[id] = float('-inf')
            
            # Apply top-k filtering
            top_k = 100  # Increased for more variety
            top_k_logits, top_k_indices = torch.topk(next_token_logits, top_k)
            probs = torch.softmax(top_k_logits, dim=-1)
            
            # Sample from the filtered distribution
            next_token_ids = top_k_indices[torch.multinomial(probs, num_predictions * 2)]  # Get more predictions to filter
            
            # Decode predictions and clean them
            predictions = []
            seen_predictions = set()
            
            for token_id in next_token_ids:
                pred = tokenizer.decode(token_id.item()).strip()
                cleaned_pred = clean_prediction(pred)
                
                # Only add valid, unique predictions
                if (cleaned_pred and 
                    cleaned_pred not in seen_predictions and 
                    len(cleaned_pred) > 1 and  # Avoid single-character predictions
                    cleaned_pred.isalnum()):  # Ensure prediction contains only letters and numbers
                    predictions.append(cleaned_pred)
                    seen_predictions.add(cleaned_pred)
                
                if len(predictions) >= num_predictions:
                    break
            
            return predictions[:num_predictions]
    except Exception as e:
        print(f"Error in prediction: {str(e)}")
        return []

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        text = data.get('text', '').strip()
        
        # Get the last word being typed
        words = text.split()
        current_word = words[-1] if words else ''
        
        # Only predict if we have some text to work with
        if current_word:
            # Use the last few words for context (if available)
            context = ' '.join(words[-3:]) if len(words) > 1 else current_word
            predictions = get_word_predictions(context)
            
            # Filter predictions to match the current word prefix
            if current_word:
                predictions = [p for p in predictions if p.lower().startswith(current_word.lower())]
            
            return jsonify({'predictions': predictions})
        return jsonify({'predictions': []})
    except Exception as e:
        print(f"Error in predict route: {str(e)}")
        return jsonify({'predictions': []})

if __name__ == '__main__':
    app.run(port=5000)