# Smart Text Editor with AI-Powered Word Predictions

A modern, responsive text editor with real-time word predictions powered by GPT-2. This project combines a React frontend with a Flask backend to create an intelligent writing assistant that suggests words as you type.

## 🌟 Features

* Real-time word predictions using GPT-2  
* Modern, responsive UI with light/dark theme support  
* Keyboard navigation for predictions (Tab to cycle, Enter to select)  
* Debounced API calls for better performance  
* Clean, minimalist design with smooth animations  
* Visual typing indicators and loading states
  ![TextPred](https://github.com/user-attachments/assets/d0716dd5-b509-48ca-94b4-0a1a5b883634)


## 🛠️ Technologies Used

### Frontend
* **React.js** for UI components  
* **Lucide React** for icons  
* **Custom CSS-in-JS styling**  
* **Real-time state management** with React hooks  

### Backend
* **Flask** for the REST API  
* **PyTorch** for machine learning operations  
* **Hugging Face Transformers** for GPT-2 integration  
* **CORS** support for cross-origin requests  
* **NumPy** for numerical operations  

## 🚀 Getting Started

### Prerequisites
* Python 3.8 or higher  
* Node.js 14.0 or higher  
* npm or yarn package manager  

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/AbhinavKaintura/PRODIGY-GA-03.git
   cd smart-text-editor
2. **Set up the backend:**
   ```bash
   # Create and activate a virtual environment (recommended)
    python -m venv venv
    source venv/bin/activate  # On Windows: venv\Scripts\activate
    
    # Install Python dependencies
    pip install -r requirements.txt
    
    # Start the Flask server
    python backend.py
3. **Set up the frontend:**
   ```bash
      # Install dependencies
      npm install
      
      # Start the development server
      npm start
4. Open your browser and navigate to http://localhost:3000

   ## 💭 Challenges Faced and Solutions

### 1. Performance Optimization
* **Challenge:** Initial API calls were being made for every keystroke, causing performance issues.  
* **Solution:**  
  - Implemented debouncing with `useEffect` and `setTimeout` to limit API calls to once every 300ms after the user stops typing.

### 2. Prediction Quality
* **Challenge:** Raw GPT-2 predictions included special tokens and irrelevant suggestions.  
* **Solution:**  
  - Implemented custom cleaning functions to remove special tokens.  
  - Added filters for minimum word length and alphanumeric content.  
  - Applied temperature scaling for better prediction diversity.  

### 3. UI/UX Considerations
* **Challenge:** Needed a smooth, intuitive interface for prediction selection.  
* **Solution:**  
  - Added keyboard navigation (Tab/Enter).  
  - Implemented visual indicators for typing and loading states.  
  - Created smooth transitions between themes and states.  

### 4. Model Loading Time
* **Challenge:** Initial loading of GPT-2 model was causing slow startup times.  
* **Solution:**  
  - Implemented lazy loading for the model.  
  - Added error handling and graceful fallbacks.  
  - Used model caching to improve subsequent load times.  

---

## 🔧 Configuration

The application can be configured through environment variables:

```env
FLASK_ENV=development
PORT=5000
MODEL_NAME=gpt2  # Can be changed to other GPT-2 variants


