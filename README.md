# Quantum Circuit Assistant with AI Integration

A Next.js application for building and simulating quantum circuits with AI-powered circuit generation using Google's Gemini API.

## Features

- **Quantum Circuit Builder**: Visual drag-and-drop interface for building quantum circuits
- **AI-Powered Circuit Generation**: Generate circuits using natural language descriptions
- **Real-time Simulation**: Simulate quantum circuits and view results
- **Educational Interface**: Learn quantum computing concepts through interactive examples

## Getting Started

### Prerequisites

- Node.js 18+ 
- A Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd SpurHacks
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
npm run setup-env
```

This will create a `.env.local` file with your Gemini API key. The file is already in `.gitignore` and won't be committed to version control.

### Manual Environment Setup

If the setup script doesn't work, create a `.env.local` file manually in the project root:

```env
# Gemini API Configuration
NEXT_PUBLIC_GEMINI_API_KEY=your_actual_api_key_here
```

### Running the Application

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Usage

### Manual Circuit Building
1. Switch to the "Manual" tab
2. Drag quantum gates from the palette to the circuit grid
3. Click "Run Quantum Circuit" to simulate

### AI-Powered Circuit Generation
1. Switch to the "AI" tab
2. Type a description of the circuit you want (e.g., "Create a quantum coin flip")
3. Click the "✨" button
4. The AI will generate and display the circuit

### Example Queries
- "Create a quantum coin flip"
- "Show me quantum entanglement"
- "Build a quantum search algorithm"
- "Demonstrate quantum interference"

## Environment Variables

See [ENVIRONMENT_SETUP.md](./ENVIRONMENT_SETUP.md) for detailed information about environment variable configuration.

## Security

- API keys are stored in environment variables and not committed to version control
- The `.env.local` file is in `.gitignore` to prevent accidental commits
- For production, consider using server-side only environment variables

## Learn More

To learn more about the technologies used:

- [Next.js Documentation](https://nextjs.org/docs)
- [Google AI Studio](https://makersuite.google.com/app/apikey)
- [Quantum Computing Concepts](https://quantum-computing.ibm.com/composer/docs/iqx/guide/)

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

Remember to add your `NEXT_PUBLIC_GEMINI_API_KEY` environment variable in the Vercel dashboard.

## Documentation

- [AI Integration Guide](./AI_INTEGRATION.md) - Detailed information about the AI integration
- [Environment Setup Guide](./ENVIRONMENT_SETUP.md) - Environment variable configuration
