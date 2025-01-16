'use client';
import { useState, useRef, FC } from 'react';
import { RecordButtonProps } from './RecordButton.type';

const RecordButton: FC<RecordButtonProps> = ({ onStop }) => {
  const [recording, setRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null); // useRef to persist across renders
  const audioChunksRef = useRef<Blob[]>([]); // Store audio chunks in a ref to preserve data between renders

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder; // Save mediaRecorder to the ref

      mediaRecorder.ondataavailable = (e) => {
        audioChunksRef.current.push(e.data); // Collect audio data
      };

      mediaRecorder.onstop = () => {
        if (mediaRecorderRef.current) {
          const audioBlob = new Blob(audioChunksRef.current, {
            type: 'audio/wav',
          });
          onStop(audioBlob); // Pass the audio Blob to the parent component
        }
        audioChunksRef.current = []; // Reset audio chunks after stop
      };

      mediaRecorder.start();
      setRecording(true);
    } catch (error) {
      console.error('Error accessing media devices: ', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop(); // Stop the recording
      setRecording(false);
    } else {
      console.error('Media recorder is not initialized');
    }
  };

  return (
    <button
      className={`px-6 py-3 rounded-md font-medium ${
        recording
          ? 'bg-red-500 text-white'
          : 'bg-primary text-white hover:bg-blue-600'
      }`}
      onClick={recording ? stopRecording : startRecording}
      disabled={recording && !mediaRecorderRef.current} // Prevent calling stop if mediaRecorder is not initialized
    >
      {recording ? 'Stop Recording' : 'Record'}
    </button>
  );
};

export default RecordButton;
