'use client';
import { useState, useRef, FC } from 'react';
import { RecordButtonProps } from './RecordButton.type';

const RecordButton: FC<RecordButtonProps> = ({ onStop, disabled = false }) => {
  const [recording, setRecording] = useState(false);
  const [loading, setLoading] = useState(false); // Loading state for processing
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (e) => {
        audioChunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        if (mediaRecorderRef.current) {
          const audioBlob = new Blob(audioChunksRef.current, {
            type: 'audio/wav',
          });
          setLoading(true); // Start loading when processing the audio
          await onStop(audioBlob); // Process the audio (calls the parent function)
          setLoading(false); // Stop loading after processing
        }
        audioChunksRef.current = [];
      };

      mediaRecorder.start();
      setRecording(true);
    } catch (error) {
      console.error('Error accessing media devices: ', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    } else {
      console.error('Media recorder is not initialized');
    }
  };

  return (
    <div className="flex flex-col items-center pt-4">
      <button
        className={`px-6 py-3 rounded-md font-medium mb-4 ${
          recording
            ? 'bg-red-500 text-white'
            : 'bg-primary text-white hover:bg-blue-600'
        }`}
        onClick={recording ? stopRecording : startRecording}
        disabled={
          (recording && !mediaRecorderRef.current) || disabled || loading
        }
      >
        {loading ? (
          <div className="flex items-center space-x-2 text-gray-600">
            <div className="w-4 h-4 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-white">Processing...</span>
          </div>
        ) : recording ? (
          'Stop Recording'
        ) : (
          'Record'
        )}
      </button>
    </div>
  );
};

export default RecordButton;
