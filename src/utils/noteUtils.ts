export const NOTE_STRINGS = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

export interface GuitarString {
    note: string;
    frequency: number;
    octave: number;
}

export const STANDARD_TUNING: GuitarString[] = [
    { note: "E", octave: 2, frequency: 82.41 },
    { note: "A", octave: 2, frequency: 110.00 },
    { note: "D", octave: 3, frequency: 146.83 },
    { note: "G", octave: 3, frequency: 196.00 },
    { note: "B", octave: 3, frequency: 246.94 },
    { note: "E", octave: 4, frequency: 329.63 },
];

export function getNoteFromFrequency(frequency: number) {
    const noteNum = 12 * (Math.log(frequency / 440) / Math.log(2));
    const midiNum = Math.round(noteNum) + 69;
    const noteName = NOTE_STRINGS[midiNum % 12];
    const octave = Math.floor(midiNum / 12) - 1;
    const cents = Math.floor((noteNum - Math.round(noteNum)) * 100);

    // Calculate target frequency for the detected note
    const targetFrequency = 440 * Math.pow(2, (midiNum - 69) / 12);

    return {
        note: noteName,
        octave,
        cents,
        difference: frequency - targetFrequency,
        frequency,
        targetFrequency
    };
}

export function getClosestString(frequency: number): GuitarString {
    let closest = STANDARD_TUNING[0];
    let minDiff = Math.abs(frequency - closest.frequency);

    for (const str of STANDARD_TUNING) {
        const diff = Math.abs(frequency - str.frequency);
        if (diff < minDiff) {
            minDiff = diff;
            closest = str;
        }
    }
    return closest;
}
