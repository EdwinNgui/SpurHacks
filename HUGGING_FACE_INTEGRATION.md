# Hugging Face QuantumLLMInstruct API Integration

This application now integrates with the Hugging Face QuantumLLMInstruct API to provide AI-powered quantum circuit generation and analysis.

## Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Variables (Optional)**
   Create a `.env.local` file in the root directory if you need to use a private Hugging Face Space:
   ```
   HUGGING_FACE_TOKEN=your_token_here
   HUGGING_FACE_ENDPOINT=BoltzmannEntropy/QuantumLLMInstruct
   ```

## API Endpoints Used

The integration uses the following endpoints from the QuantumLLMInstruct Space:

1. **`/reload_model`** - Reload the quantum model
2. **`/generate_and_display`** - Generate quantum problems and solutions
3. **`/generate_solutions`** - Generate solutions for existing problems
4. **`/load_summary_from_duckdb`** - Load summary data from database
5. **`/view_db_data`** - View database data
6. **`/export_parquet`** - Export data to parquet format

## How It Works

1. **User Query Processing**: When a user enters a query in the AI Assistant, it's sent to the Hugging Face API
2. **Domain Mapping**: The query is mapped to appropriate quantum domains (e.g., "entanglement" → "Entanglement and Quantum Information Theory")
3. **Problem Generation**: The API generates quantum problems and solutions based on the selected domains
4. **Circuit Mapping**: The response is parsed and mapped to predefined quantum circuits in our application
5. **Fallback**: If the API fails, the system falls back to the local implementation

## Supported Query Types

The system can handle queries related to:
- **Entanglement**: Bell states, quantum correlation
- **Superposition**: Quantum superposition states
- **Random Generation**: Quantum coin flips, random number generation
- **Search Algorithms**: Grover's algorithm, quantum search
- **Interference**: Quantum interference effects
- **Circuit Design**: QASM generation, PennyLane circuits
- **Measurement**: Quantum measurement protocols
- **Hamiltonians**: Quantum Hamiltonians, molecular systems
- **VQE**: Variational Quantum Eigensolver
- **QAOA**: Quantum Approximation Optimization Algorithm
- **And many more quantum computing concepts**

## Error Handling

The integration includes robust error handling:
- API connection failures fall back to local implementation
- Network timeouts are handled gracefully
- Invalid responses are parsed safely
- User feedback is provided for all states

## Usage

1. Navigate to the `/quantassist` route
2. Click on the "AI" tab in the control panel
3. Enter your quantum computing query
4. The AI will generate a circuit and explanation
5. Click "Run Quantum Circuit" to simulate the result

## Customization

You can customize the integration by:
- Modifying the domain mapping in `src/lib/huggingface-api.ts`
- Adding new quantum algorithms to the `quantumAlgorithms` object
- Adjusting the response parsing logic
- Adding new API endpoints as needed 