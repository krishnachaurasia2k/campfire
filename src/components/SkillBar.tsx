import React from 'react';

interface SkillBarProps {
    onShapeshiftClick: () => void;
    isImagination: boolean;
}

export const SkillBar: React.FC<SkillBarProps> = ({ onShapeshiftClick, isImagination }) => {
    return (
        <div style={{
            position: 'absolute',
            bottom: '20px',
            right: '20px',
            zIndex: 100,
            display: 'flex',
            gap: '10px'
        }}>
            <button
                onClick={onShapeshiftClick}
                disabled={isImagination}
                style={{
                    backgroundColor: isImagination ? '#555' : '#8a2be2',
                    color: 'white',
                    border: '2px solid #333',
                    borderRadius: '50%',
                    width: '60px',
                    height: '60px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    cursor: isImagination ? 'not-allowed' : 'pointer',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.5)',
                    transition: 'transform 0.1s'
                }}
                onMouseDown={e => e.currentTarget.style.transform = 'scale(0.95)'}
                onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
            >
                SHIFT<br />(Q)
            </button>
        </div>
    );
}
