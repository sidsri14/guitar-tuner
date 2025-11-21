import React from 'react';
import { Check } from 'lucide-react';

interface TunerGaugeProps {
    cents: number;
    note: string;
    octave: number;
    clarity: number;
}

export const TunerGauge: React.FC<TunerGaugeProps> = ({ cents, note, octave }) => {
    // Clamp cents between -50 and 50 for display
    const clampedCents = Math.max(-50, Math.min(50, cents));
    const isTune = Math.abs(cents) < 5;

    // Calculate rotation angle (-45deg to 45deg)
    const rotation = (clampedCents / 50) * 45;

    const color = isTune ? 'text-green-500' : 'text-red-500';
    const borderColor = isTune ? 'border-green-500' : 'border-red-500';

    return (
        <div className="flex flex-col items-center justify-center p-8">
            <div className="relative w-64 h-32 overflow-hidden mb-4">
                {/* Gauge Background */}
                <div className="absolute top-0 left-0 w-full h-full bg-gray-800 rounded-t-full opacity-20"></div>

                {/* Ticks */}
                <div className="absolute bottom-0 left-1/2 w-1 h-4 bg-gray-500 -translate-x-1/2"></div>
                <div className="absolute bottom-0 left-1/2 w-1 h-3 bg-gray-600 -translate-x-1/2 rotate-[-22.5deg] origin-bottom"></div>
                <div className="absolute bottom-0 left-1/2 w-1 h-3 bg-gray-600 -translate-x-1/2 rotate-[22.5deg] origin-bottom"></div>
                <div className="absolute bottom-0 left-1/2 w-1 h-3 bg-gray-600 -translate-x-1/2 rotate-[-45deg] origin-bottom"></div>
                <div className="absolute bottom-0 left-1/2 w-1 h-3 bg-gray-600 -translate-x-1/2 rotate-[45deg] origin-bottom"></div>

                {/* Needle */}
                <div
                    className={`absolute bottom-0 left-1/2 w-1 h-28 bg-white origin-bottom transition-transform duration-100 ease-out ${isTune ? 'bg-green-400 shadow-[0_0_10px_#4ade80]' : 'bg-red-500'}`}
                    style={{ transform: `translateX(-50%) rotate(${rotation}deg)` }}
                ></div>

                {/* Pivot */}
                <div className="absolute bottom-0 left-1/2 w-4 h-4 bg-gray-200 rounded-full -translate-x-1/2 translate-y-1/2 z-10"></div>
            </div>

            {/* Note Display */}
            <div className={`flex flex-col items-center justify-center w-32 h-32 rounded-full border-4 ${borderColor} bg-gray-900 transition-colors duration-300`}>
                {isTune && <Check className="text-green-500 mb-1" size={24} />}
                <span className={`text-6xl font-bold ${color}`}>{note}</span>
                <span className="text-xl text-gray-400">{octave}</span>
            </div>

            <div className="mt-4 text-gray-400 font-mono">
                {cents > 0 ? `+${cents}` : cents} cents
            </div>
        </div>
    );
};
