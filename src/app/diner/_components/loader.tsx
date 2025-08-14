import React from 'react';

interface SplashScreenProps {
    imageSrc: string;
    alt?: string;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ imageSrc = '/text-logo.png', alt = 'Loading...' }) => (
    <div className="h-screen w-screen flex items-center justify-center bg-white">
        <img
            src={imageSrc}
            alt={alt}
            className="max-w-[60vw] max-h-[60vh] animate-bounce transition-all duration-700"
            style={{ animation: 'splashFadeIn 1.2s ease-in-out' }}
        />
        <style>
            {`
                @keyframes splashFadeIn {
                    0% { opacity: 0.5; transform: scale(0.95); }
                    100% { opacity: 1; transform: scale(1); }
                }
            `}
        </style>
    </div>
);

export default SplashScreen;
