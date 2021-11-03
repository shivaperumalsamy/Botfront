import { useSound } from 'use-sound';
import defaultTone from '../../../../../../sounds/default.mp3';

export const MessageTone = () => {
    const [play] = useSound(defaultTone, { volume: 0.25 });
    play();
    return null;
};
