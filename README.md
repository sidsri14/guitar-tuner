# Pro Guitar Tuner 🎸

A modern, web-based guitar tuner built with React, TypeScript, and the Web Audio API. Features real-time pitch detection, a visual tuning gauge, and a guitar headstock visualization.


## ✨ Features

- **Real-time Pitch Detection**: Uses autocorrelation algorithms to accurately detect frequency and musical notes from microphone input.
- **Visual Tuner Gauge**: Precise needle gauge showing cents deviation (sharp/flat) for accurate tuning.
- **Interactive Headstock**: Visual representation of guitar strings that highlights the detected string.
- **Frequency Graph**: Live visualization of the audio waveform.
- **Simulation Mode**: Built-in test mode to demonstrate functionality without an instrument.
- **Responsive Design**: Fully responsive UI that works on desktop and mobile devices.

## 🛠️ Tech Stack

- **Frontend Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite 5](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Audio Processing**: [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
- **Icons**: [Lucide React](https://lucide.dev/)

## 🚀 Getting Started

### Prerequisites

- Node.js (v20.19.0+ or v22.12.0+ recommended)
- npm (v10+)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/sidsri14/guitar-tuner.git
   cd guitar-tuner
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Running Locally

To start the development server:

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Building for Production

To build the application for production:

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## 📖 Usage

1. **Grant Permissions**: When you first load the app, allow microphone access when prompted.
2. **Tune Your Guitar**: Pluck a string on your guitar. The tuner will detect the note and show you how close it is to the nearest standard tuning note (E, A, D, G, B, E).
   - **Green Check**: In tune!
   - **Red Needle**: Tune up or down as indicated.
3. **Simulation**: Click the "Simulate" button to see the tuner in action with a generated test tone.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

