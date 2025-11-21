import React from 'react';
import { STANDARD_TUNING } from '../utils/noteUtils';

interface GuitarHeadstockProps {
    currentNote: string;
    currentOctave: number;
}

export const GuitarHeadstock: React.FC<GuitarHeadstockProps> = ({ currentNote, currentOctave }) => {
    const activeStringIndex = STANDARD_TUNING.findIndex(
        s => s.note === currentNote && s.octave === currentOctave
    );

    return (
        <div className="relative w-64 h-96 bg-gray-900 rounded-xl p-4 flex items-center justify-center border border-gray-700 shadow-2xl">
            {/* Headstock Shape (Simplified) */}
            <div className="absolute inset-0 bg-[#2a2a2a] rounded-t-3xl rounded-b-xl opacity-50"></div>

            <div className="relative z-10 flex justify-between w-full px-8 h-full py-12">
                {/* Left Tuners (E2, A2, D3) */}
                <div className="flex flex-col justify-between h-full">
                    {STANDARD_TUNING.slice(0, 3).reverse().map((str, i) => {
                        const index = 2 - i; // Map back to original index: 2, 1, 0
                        const isActive = index === activeStringIndex;
                        return (
                            <div key={str.note + str.octave} className="flex items-center">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${isActive ? 'bg-green-500/20 border-green-500 text-green-500 scale-110 shadow-[0_0_15px_rgba(34,197,94,0.5)]' : 'bg-gray-800 border-gray-600 text-gray-400'}`}>
                                    <span className="font-bold text-lg">{str.note}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Strings Visual */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-full flex justify-between px-2 py-12 opacity-30">
                    {[0, 1, 2, 3, 4, 5].map(i => (
                        <div key={i} className="w-0.5 h-full bg-gray-400"></div>
                    ))}
                </div>

                {/* Right Tuners (G3, B3, E4) */}
                <div className="flex flex-col justify-between h-full">
                    {STANDARD_TUNING.slice(3).map((str, i) => {
                        const index = 3 + i;
                        const isActive = index === activeStringIndex;
                        return (
                            <div key={str.note + str.octave} className="flex items-center">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${isActive ? 'bg-green-500/20 border-green-500 text-green-500 scale-110 shadow-[0_0_15px_rgba(34,197,94,0.5)]' : 'bg-gray-800 border-gray-600 text-gray-400'}`}>
                                    <span className="font-bold text-lg">{str.note}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
