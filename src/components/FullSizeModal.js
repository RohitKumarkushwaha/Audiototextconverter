import React, { useState, useEffect, useRef } from 'react';
import './FullSizeModal.css';

const FullSizeModal = ({ showModal, closeModal }) => {
  const [transcriptName, setTranscriptName] = useState('');
  const [transcription, setTranscription] = useState('');
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    // Check for browser compatibility
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Sorry, your browser doesn't support Speech Recognition.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognitionRef.current = recognition;

    recognition.onresult = (event) => {
      let interimTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcriptSegment = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          setTranscription(prevTranscription => prevTranscription + transcriptSegment + ' ');
        } else {
          interimTranscript += transcriptSegment;
        }
      }
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
    };

    recognition.onend = () => {
      if (isListening) {
        recognition.start(); // Restart recognition if it stops unexpectedly
      }
    };

    if (isListening) {
      recognition.start();
    }

    return () => {
      recognition.stop();
    };
  }, [isListening]);

  const startListening = () => {
    setIsListening(true);
  };

  const stopListening = () => {
    setIsListening(false);
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  if (!showModal) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <button onClick={closeModal} className="close-button">X</button>
        <h2>{transcriptName}</h2>
        <input
          type="text"
          value={transcriptName}
          onChange={(e) => setTranscriptName(e.target.value)}
          placeholder="Enter Transcript Name"
          className="input"
        />
        {isListening ? (
          <button onClick={stopListening} className="stop-button">
            Stop Transcription
          </button>
        ) : (
          <button onClick={startListening} className="start-button">
            Start Transcription
          </button>
        )}
        <div className="transcription">
          <p>{transcription}</p>
        </div>
      </div>
    </div>
  );
};

export default FullSizeModal;
