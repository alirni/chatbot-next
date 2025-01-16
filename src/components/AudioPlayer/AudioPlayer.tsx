import { FC } from 'react';
import { AudioPlayerProps } from './AudioPlayer.type';

const AudioPlayer: FC<AudioPlayerProps> = ({ src }) => (
  <div className="mt-4">
    <audio
      controls
      src={src}
      className="w-full rounded-md border border-gray-300"
    />
  </div>
);

export default AudioPlayer;
