import React, { useEffect, useRef } from 'react';

interface FrequencyGraphProps {
    analyserNode: AnalyserNode | null;
    isListening: boolean;
}

export const FrequencyGraph: React.FC<FrequencyGraphProps> = ({ analyserNode, isListening }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const rafIdRef = useRef<number | null>(null);

    useEffect(() => {
        if (!analyserNode || !isListening || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const bufferLength = analyserNode.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const draw = () => {
            rafIdRef.current = requestAnimationFrame(draw);

            analyserNode.getByteTimeDomainData(dataArray);

            ctx.fillStyle = 'rgb(20, 20, 20)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.lineWidth = 2;
            ctx.strokeStyle = '#4ade80'; // Green-400
            ctx.beginPath();

            const sliceWidth = canvas.width * 1.0 / bufferLength;
            let x = 0;

            for (let i = 0; i < bufferLength; i++) {
                const v = dataArray[i] / 128.0;
                const y = v * canvas.height / 2;

                if (i === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }

                x += sliceWidth;
            }

            ctx.lineTo(canvas.width, canvas.height / 2);
            ctx.stroke();
        };

        draw();

        return () => {
            if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
        };
    }, [analyserNode, isListening]);

    return (
        <canvas
            ref={canvasRef}
            width={800}
            height={200}
            className="w-full h-32 bg-gray-900 rounded-lg border border-gray-700 shadow-inner"
        />
    );
};
