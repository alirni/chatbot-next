'use client';
import { useState } from 'react';
import { MessageDisplay, RecordButton } from '@/components';

const Home = () => {
  const [messages, setMessages] = useState<{ user: string; ai: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [aiTyping, setAiTyping] = useState(false);

  const handleVoiceProcessing = async (audio: Blob) => {
    setLoading(true);
    setAiTyping(true);
    const formData = new FormData();
    formData.append('audio', audio, 'recorded_audio.wav');

    try {
      // Send the FormData with audio to the backend
      const transcriptionResponse = await fetch('/api/voice-to-text', {
        method: 'POST',
        body: formData,
      });

      if (!transcriptionResponse.ok) {
        throw new Error(
          `Failed to transcribe audio: ${transcriptionResponse.statusText}`
        );
      }

      const transcription = await transcriptionResponse.json();

      const userMessage = transcription.text;

      if (!userMessage) {
        alert('No transcription detected. Please try again.');
        setLoading(false);
        setAiTyping(false);
        return;
      }

      // Add user's message to chat
      setMessages((prev) => [...prev, { user: userMessage, ai: '' }]);

      // Send the transcribed text to the chat API
      const aiResponse = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage }),
      });

      const aiText = await aiResponse.json();

      // Send the AI response text to convert it to speech
      const voiceResponse = await fetch('/api/text-to-voice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: aiText }),
      });

      const { audio } = await voiceResponse.json();

      const audioPlayer = new Audio(audio);
      audioPlayer.play(); // Automatically play the audio

      // Animated typing effect for AI response
      let displayedText = '';
      const typingInterval = setInterval(() => {
        if (displayedText.length < aiText.length) {
          displayedText += aiText[displayedText.length];
          setMessages((prev) => {
            const updatedMessages = [...prev];
            updatedMessages[updatedMessages.length - 1].ai = displayedText;
            return updatedMessages;
          });
        } else {
          clearInterval(typingInterval);
          setAiTyping(false);
        }
      }, 50); // Typing speed (50ms per character)
      setLoading(false);
    } catch (error) {
      console.error('Error processing voice:', error);
      setLoading(false);
      setAiTyping(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold text-accent text-center mb-6">
        Voice ChatBot
      </h1>
      <MessageDisplay messages={messages} isTyping={aiTyping} />
      <RecordButton onStop={handleVoiceProcessing} disabled={loading} />
    </div>
  );
};

export default Home;
