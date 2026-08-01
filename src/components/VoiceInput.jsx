// src/components/VoiceInput.jsx
import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';

export const VoiceInput = ({ onTranscript, onError }) => {
  const { isDarkMode } = useTheme();
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);

  const startListening = () => {
    // Check browser support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      onError('Speech recognition is not supported in this browser.');
      return;
    }

    const recognitionInstance = new SpeechRecognition();
    recognitionInstance.lang = 'en-US';
    recognitionInstance.continuous = false;
    recognitionInstance.interimResults = true;

    recognitionInstance.onresult = (event) => {
      let transcript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          onTranscript(transcript);
          setIsListening(false);
        }
      }
      if (!event.results[event.results.length - 1].isFinal) {
        onTranscript(transcript); // interim result
      }
    };

    recognitionInstance.onerror = (event) => {
      onError(event.error);
      setIsListening(false);
    };

    recognitionInstance.onend = () => {
      setIsListening(false);
    };

    recognitionInstance.start();
    setRecognition(recognitionInstance);
    setIsListening(true);
  };

  const stopListening = () => {
    if (recognition) {
      recognition.stop();
      setIsListening(false);
    }
  };

  return (
    <button
      type="button"
      onClick={isListening ? stopListening : startListening}
      style={{
        background: isListening ? '#e74c3c' : (isDarkMode ? '#2d2d44' : '#f0f0f0'),
        border: 'none',
        borderRadius: '5px',
        padding: '8px 12px',
        fontSize: '20px',
        cursor: 'pointer',
        transition: 'background 0.2s, transform 0.1s',
        marginLeft: '5px',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: isListening ? '#fff' : (isDarkMode ? '#e0e0e0' : '#2c3e50')
      }}
      onMouseEnter={(e) => {
        if (!isListening) e.target.style.background = isDarkMode ? '#444' : '#ddd';
      }}
      onMouseLeave={(e) => {
        if (!isListening) e.target.style.background = isDarkMode ? '#2d2d44' : '#f0f0f0';
      }}
      aria-label={isListening ? 'Stop listening' : 'Start voice input'}
    >
      {isListening ? '⏹️' : '🎤'}
    </button>
  );
};