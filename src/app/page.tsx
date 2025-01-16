'use client';
import { useState } from 'react';
import { AudioPlayer, MessageDisplay, RecordButton } from '@/components';

const Home = () => {
  const [messages, setMessages] = useState<{ user: string; ai: string }[]>([]);
  const [audioSrc, setAudioSrc] = useState<string | null>(null);

  const handleVoiceProcessing = async (audio: Blob) => {
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

      // Send the transcribed text to the chat API
      const aiResponse = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: transcription.text }),
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

      setMessages((prev) => [
        ...prev,
        { user: transcription.text, ai: aiText },
      ]);
      setAudioSrc(audio);
    } catch (error) {
      console.error('Error processing voice:', error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold text-accent text-center mb-6">
        Voice ChatBot
      </h1>
      <RecordButton onStop={handleVoiceProcessing} />
      <MessageDisplay messages={messages} />
      {audioSrc && <AudioPlayer src={audioSrc} />}
    </div>
  );
};

export default Home;
