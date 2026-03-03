import React from 'react';
import './GlitchOverlay.css'; // We will create this

interface GlitchOverlayProps {
    sanityIntensity: number; // 0.0 to 1.0
    isImagination: boolean;
}

export const GlitchOverlay: React.FC<GlitchOverlayProps> = ({ sanityIntensity, isImagination }) => {
    // Base overlay style depends heavily on sanity and transition state
    const noiseOpacity = Math.min(0.8, sanityIntensity * 1.5);

    // Create a red vignette the higher the sanity gets
    const vignetteShadow = `inset 0 0 ${150 * sanityIntensity}px rgba(255, 0, 0, ${sanityIntensity * 0.5})`;

    return (
        <>
            <div
                className={`glitch-overlay ${isImagination ? 'imagination-active' : ''}`}
                style={{
                    position: 'absolute',
                    top: 0, left: 0, right: 0, bottom: 0,
                    pointerEvents: 'none', // click through to the canvas
                    zIndex: 50,
                    boxShadow: vignetteShadow,
                    backgroundColor: isImagination ? 'rgba(20, 0, 20, 0.4)' : 'transparent',
                    mixBlendMode: 'multiply',
                    opacity: isImagination ? 1 : noiseOpacity,
                    backdropFilter: `blur(${sanityIntensity * 4}px) contrast(${100 + sanityIntensity * 50}%)`,
                }}
            >
                {/* Dynamic Static noise / CRT scanlines simulating sanity failure */}
                {sanityIntensity > 0 && (
                    <div className="crts-scanlines" style={{ opacity: sanityIntensity }} />
                )}
            </div>

            {/* Extreme tearing glitch effect shown only when high sanity */}
            <div
                className={sanityIntensity > 0.8 ? 'screen-tear-active' : ''}
                style={{
                    position: 'absolute',
                    top: 0, left: 0, width: '100%', height: '100%',
                    pointerEvents: 'none',
                    zIndex: 51
                }}
            />
        </>
    );
};
