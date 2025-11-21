import { useState, useEffect } from 'react';
import { Mic, MicOff, Play } from 'lucide-react';
import { useAudioAnalyzer } from './hooks/useAudioAnalyzer';
import { TunerGauge } from './components/TunerGauge';
import { GuitarHeadstock } from './components/GuitarHeadstock';
import { FrequencyGraph } from './components/FrequencyGraph';
import { getNoteFromFrequency } from './utils/noteUtils';

function App() {
  const { isListening, startListening, stopListening, audioData, error, analyserNode } = useAudioAnalyzer();
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulatedData, setSimulatedData] = useState<any>(null);

  // Simulation Logic
  useEffect(() => {
    let interval: any;
    if (isSimulating) {
      // Simulate an E2 string (82.41 Hz) slightly out of tune
      let freq = 82.0;
      let direction = 0.05;

      interval = setInterval(() => {
        freq += direction;
        if (freq > 83.0 || freq < 81.5) direction *= -1;

        const noteData = getNoteFromFrequency(freq);
        setSimulatedData({
          ...noteData,
          frequency: freq,
          clarity: 0.9,
          volume: 0.5
        });
      }, 50);
    } else {
      setSimulatedData(null);
    }
    return () => clearInterval(interval);
  }, [isSimulating]);

  const currentData = isSimulating ? simulatedData : audioData;

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
      setIsSimulating(false);
    }
  };

  const toggleSimulation = () => {
    if (isSimulating) {
      setIsSimulating(false);
    } else {
      stopListening();
      setIsSimulating(true);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-950 text-white flex flex-col items-center py-12 px-4">
      <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
        Guitar Tuner
      </h1>

      {error && (
        <div className="mb-4 p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-200">
          {error}
        </div>
      )}

      <div className="flex gap-4 mb-8">
        <button
          onClick={toggleListening}
          className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all ${isListening
            ? 'bg-red-500 hover:bg-red-600 text-white shadow-[0_0_20px_rgba(239,68,68,0.4)]'
            : 'bg-green-500 hover:bg-green-600 text-white shadow-[0_0_20px_rgba(34,197,94,0.4)]'
            }`}
        >
          {isListening ? <><MicOff size={20} /> Stop Listening</> : <><Mic size={20} /> Start Tuner</>}
        </button>

        <button
          onClick={toggleSimulation}
          className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all border-2 ${isSimulating
            ? 'border-blue-500 bg-blue-500/20 text-blue-400'
            : 'border-gray-600 hover:border-gray-400 text-gray-400'
            }`}
        >
          <Play size={20} /> {isSimulating ? 'Stop Sim' : 'Simulate'}
        </button>
      </div>

      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="flex flex-col items-center">
          <TunerGauge
            cents={currentData?.cents || 0}
            note={currentData?.note || '-'}
            octave={currentData?.octave || 0}
            clarity={currentData?.clarity || 0}
          />

          <div className="mt-8 w-full">
            <FrequencyGraph
              analyserNode={analyserNode}
              isListening={isListening}
            />
            {isSimulating && (
              <div className="w-full h-32 bg-gray-900 rounded-lg border border-gray-700 flex items-center justify-center text-gray-500">
                (Graph unavailable in simulation)
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-center">
          <GuitarHeadstock
            currentNote={currentData?.note || ''}
            currentOctave={currentData?.octave || 0}
          />
        </div>
      </div>

      <div className="mt-12 text-gray-500 text-sm">
        {currentData ? `Freq: ${currentData.frequency.toFixed(1)} Hz` : 'Waiting for sound...'}
      </div>
    </div>
  );
}

export default App;
