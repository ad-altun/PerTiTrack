import { useState, useEffect } from 'react';

export const useDynamicLocalTime = () => {
    const [currentTime, setCurrentTime] = useState(() => {
        return new Date().toLocaleTimeString('de-DE', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        });
    });

    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();
            const timeString = now.toLocaleTimeString('de-DE', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false
            });
            setCurrentTime(timeString);
        }, 1000); // Update every second

        return () => clearInterval(interval);
    }, []);

    return currentTime;
};