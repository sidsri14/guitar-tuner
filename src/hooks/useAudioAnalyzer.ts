import { useState, useEffect, useRef, useCallback } from 'react';
import { getNoteFromFrequency } from '../utils/noteUtils';

interface AudioData {
    frequency: number;
    note: string;
    cents: number;
    octave: number;
    clarity: number;
    volume: number;
}

export function useAudioAnalyzer() {
    const [isListening, setIsListening] = useState(false);
    const [audioData, setAudioData] = useState<AudioData | null>(null);
    const [error, setError] = useState<string | null>(null);

    const audioContextRef = useRef<AudioContext | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
    const rafIdRef = useRef<number | null>(null);

    const autoCorrelate = (buffer: Float32Array, sampleRate: number) => {
        let size = buffer.length;
        let rms = 0;

        for (let i = 0; i < size; i++) {
            const val = buffer[i];
            rms += val * val;
        }
        rms = Math.sqrt(rms / size);

        if (rms < 0.01) return -1; // Not enough signal

        let r1 = 0, r2 = size - 1, thres = 0.2;
        for (let i = 0; i < size / 2; i++) {
            if (Math.abs(buffer[i]) < thres) { r1 = i; break; }
        }
        for (let i = 1; i < size / 2; i++) {
            if (Math.abs(buffer[size - i]) < thres) { r2 = size - i; break; }
        }

        buffer = buffer.slice(r1, r2);
        size = buffer.length;

        const c = new Array(size).fill(0);
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size - i; j++) {
                c[i] = c[i] + buffer[j] * buffer[j + i];
            }
        }

        let d = 0;
        while (c[d] > c[d + 1]) d++;
        let maxval = -1, maxpos = -1;
        for (let i = d; i < size; i++) {
            if (c[i] > maxval) {
                maxval = c[i];
                maxpos = i;
            }
        }
        let T0 = maxpos;

        const x1 = c[T0 - 1], x2 = c[T0], x3 = c[T0 + 1];
        const a = (x1 + x3 - 2 * x2) / 2;
        const b = (x3 - x1) / 2;
        if (a) T0 = T0 - b / (2 * a);

        return sampleRate / T0;
    };

    const startListening = useCallback(async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
            analyserRef.current = audioContextRef.current.createAnalyser();
            analyserRef.current.fftSize = 2048;

            sourceRef.current = audioContextRef.current.createMediaStreamSource(stream);
            sourceRef.current.connect(analyserRef.current);

            setIsListening(true);
            setError(null);

            const updatePitch = () => {
                if (!analyserRef.current || !audioContextRef.current) return;

                const buffer = new Float32Array(analyserRef.current.fftSize);
                analyserRef.current.getFloatTimeDomainData(buffer);

                const frequency = autoCorrelate(buffer, audioContextRef.current.sampleRate);

                if (frequency !== -1) {
                    const noteData = getNoteFromFrequency(frequency);
                    // Calculate volume (RMS) for clarity/threshold
                    let sum = 0;
                    for (let i = 0; i < buffer.length; i++) sum += buffer[i] * buffer[i];
                    const volume = Math.sqrt(sum / buffer.length);

                    setAudioData({
                        ...noteData,
                        frequency,
                        clarity: 1, // Placeholder for now
                        volume
                    });
                }

                rafIdRef.current = requestAnimationFrame(updatePitch);
            };

            updatePitch();

        } catch (err) {
            setError("Microphone access denied or not available.");
            console.error(err);
        }
    }, []);

    const stopListening = useCallback(() => {
        if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
        if (sourceRef.current) sourceRef.current.disconnect();
        if (analyserRef.current) analyserRef.current.disconnect();
        if (audioContextRef.current) audioContextRef.current.close();

        setIsListening(false);
        setAudioData(null);
    }, []);

    useEffect(() => {
        return () => {
            stopListening();
        };
    }, [stopListening]);

    return { isListening, startListening, stopListening, audioData, error, analyserNode: analyserRef.current };
}
