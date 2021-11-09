import React from 'react';
import { useSound } from 'use-sound';
import defaultTone from '../../../../../../sounds/default.mp3';

export const MessageTone = (props) => {
    const [play] = useSound(defaultTone, { volume: 0.5 });
    play();
    return <div className="rw-message-tone"></div>;
};
