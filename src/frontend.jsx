import React, { useState, useEffect, useRef } from 'react';
import { Keyboard, Type, Lightbulb, Sparkles, Send } from 'lucide-react';

const TextEditor = () => {
  const [text, setText] = useState('');
  const [predictions, setPredictions] = useState([]);
  const [selectedPrediction, setSelectedPrediction] = useState(-1);
  const [theme, setTheme] = useState('light');
  const [isTyping, setIsTyping] = useState(false);
  const timeoutRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const editorRef = useRef(null);

  const colors = {
    light: {
      bg: '#ffffff',
      primary: '#2563eb',
      secondary: '#f3f4f6',
      text: '#1f2937',
      border: '#e5e7eb',
      gradient: 'linear-gradient(135deg, #60a5fa, #3b82f6)',
      hover: '#dbeafe'
    },
    dark: {
      bg: '#1f2937',
      primary: '#3b82f6',
      secondary: '#374151',
      text: '#f9fafb',
      border: '#374151',
      gradient: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
      hover: '#2563eb'
    }
  };

  const currentTheme = colors[theme];

  const fetchPredictions = async (inputText) => {
    try {
      if (inputText.trim() && !inputText.endsWith(' ')) {
        const response = await fetch('http://localhost:5000/predict', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ text: inputText }),
        });
        const data = await response.json();
        setPredictions(data.predictions);
      } else {
        setPredictions([]);
      }
    } catch (error) {
      console.error('Error fetching predictions:', error);
      setPredictions([]);
    }
  };

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      fetchPredictions(text);
    }, 300);

    // Typing indicator
    setIsTyping(true);
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => setIsTyping(false), 1000);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, [text]);

  const handleTextChange = (e) => {
    setText(e.target.value);
    setSelectedPrediction(-1);
  };

  const handlePredictionClick = (prediction) => {
    const spacer = text.endsWith(' ') ? '' : ' ';
    setText(text + spacer + prediction + ' ');
    setPredictions([]);
    editorRef.current.focus();
  };

  const handleKeyDown = (e) => {
    if (predictions.length > 0) {
      if (e.key === 'Tab') {
        e.preventDefault();
        const newIndex = (selectedPrediction + 1) % predictions.length;
        setSelectedPrediction(newIndex);
      } else if (e.key === 'Enter' && selectedPrediction !== -1) {
        e.preventDefault();
        handlePredictionClick(predictions[selectedPrediction]);
      }
    }
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: theme === 'light' ? '#f3f4f6' : '#111827',
      padding: '40px 20px',
      transition: 'background-color 0.3s ease'
    }}>
      <div style={{
        maxWidth: '900px',
        margin: '0 auto',
        position: 'relative'
      }}>
        {/* Header Section */}
        <div style={{
          background: currentTheme.gradient,
          padding: '30px',
          borderRadius: '12px',
          marginBottom: '20px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Type size={32} />
            <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>
              Smart Text Editor
            </h1>
          </div>
          <button
            onClick={toggleTheme}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '20px',
              color: 'white',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <Lightbulb size={16} />
            {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
          </button>
        </div>

        {/* Main Editor Section */}
        <div style={{
          backgroundColor: currentTheme.bg,
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          transition: 'all 0.3s ease'
        }}>
          {/* Editor Controls */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '16px',
            gap: '12px',
            color: currentTheme.text
          }}>
            <Keyboard size={20} />
            <span>Type or click suggestions below</span>
            {isTyping && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: currentTheme.primary
              }}>
                <Sparkles size={16} />
                <span>Generating predictions...</span>
              </div>
            )}
          </div>

          {/* Text Area */}
          <textarea
            ref={editorRef}
            style={{
              width: '100%',
              height: '200px',
              padding: '16px',
              border: `2px solid ${currentTheme.border}`,
              borderRadius: '8px',
              fontSize: '16px',
              resize: 'vertical',
              backgroundColor: currentTheme.bg,
              color: currentTheme.text,
              outline: 'none',
              transition: 'all 0.3s ease',
              marginBottom: '16px',
              fontFamily: 'system-ui, -apple-system, sans-serif',
            }}
            value={text}
            onChange={handleTextChange}
            onKeyDown={handleKeyDown}
            placeholder="Start typing your text here..."
          />

          {/* Predictions Section */}
          {predictions.length > 0 && (
            <div style={{
              background: `linear-gradient(to right, ${currentTheme.secondary}, ${currentTheme.bg})`,
              padding: '16px',
              borderRadius: '8px',
              marginTop: '16px'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '12px',
                color: currentTheme.text
              }}>
                <Send size={16} />
                <span>Suggestions:</span>
              </div>
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '8px'
              }}>
                {predictions.map((prediction, index) => (
                  <button
                    key={index}
                    onClick={() => handlePredictionClick(prediction)}
                    style={{
                      padding: '8px 16px',
                      fontSize: '14px',
                      border: 'none',
                      borderRadius: '20px',
                      cursor: 'pointer',
                      backgroundColor: index === selectedPrediction ? currentTheme.primary : currentTheme.secondary,
                      color: index === selectedPrediction ? 'white' : currentTheme.text,
                      transition: 'all 0.2s ease',
                      outline: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                      ':hover': {
                        backgroundColor: currentTheme.hover
                      }
                    }}
                  >
                    <Sparkles size={12} />
                    {prediction}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          textAlign: 'center',
          marginTop: '20px',
          color: currentTheme.text,
          fontSize: '14px'
        }}>
          <p>Press Tab to cycle through predictions and Enter to select</p>
        </div>
      </div>
    </div>
  );
};

export default TextEditor;