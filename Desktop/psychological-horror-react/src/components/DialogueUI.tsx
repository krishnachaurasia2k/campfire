import React, { useState, useEffect } from 'react';

interface DialogueLine {
    name: string;
    text: string;
}

interface DialogueUIProps {
    dialogue?: DialogueLine[];
    onComplete: () => void;
}

export const DialogueUI: React.FC<DialogueUIProps> = ({ dialogue, onComplete }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [displayedText, setDisplayedText] = useState('');
    const [isTyping, setIsTyping] = useState(false);

    useEffect(() => {
        if (!dialogue || dialogue.length === 0) return;

        let textToType = dialogue[currentIndex].text;
        let i = 0;
        setIsTyping(true);
        setDisplayedText('');

        const typingInterval = setInterval(() => {
            setDisplayedText(textToType.slice(0, i));
            i++;
            if (i > textToType.length) {
                clearInterval(typingInterval);
                setIsTyping(false);
            }
        }, 50); // Typing speed

        return () => clearInterval(typingInterval);
    }, [currentIndex, dialogue]);

    if (!dialogue || dialogue.length === 0) return null;

    const handleNext = () => {
        if (isTyping) {
            // Skip typing
            setDisplayedText(dialogue[currentIndex].text);
            setIsTyping(false);
        } else {
            if (currentIndex < dialogue.length - 1) {
                setCurrentIndex(prev => prev + 1);
            } else {
                onComplete();
            }
        }
    };

    const currentLine = dialogue[currentIndex];

    return (
        <div
            style={{
                position: 'absolute',
                bottom: '20px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '600px',
                maxWidth: '90%',
                backgroundColor: 'rgba(0, 0, 0, 0.85)',
                border: '2px solid #555',
                borderRadius: '8px',
                padding: '20px',
                color: 'white',
                fontFamily: 'monospace',
                zIndex: 100,
                boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
                cursor: 'pointer'
            }}
            onClick={handleNext}
        >
            <h3 style={{ margin: '0 0 10px 0', color: '#ffb347' }}>{currentLine.name}</h3>
            <p style={{ margin: 0, fontSize: '18px', minHeight: '54px' }}>
                {displayedText}
            </p>

            {!isTyping && (
                <div style={{ position: 'absolute', bottom: '10px', right: '15px', fontSize: '12px', opacity: 0.7 }}>
                    Click to continue ▼
                </div>
            )}
        </div>
    );
};
