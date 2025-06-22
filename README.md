# Quantum Circuit Assistant with AI & Qiskit Integration

A comprehensive Next.js application for building, simulating, and learning quantum circuits with AI-powered circuit generation and automatic Qiskit code export.

## 🚀 Features

### **Core Functionality**
- **Visual Quantum Circuit Builder**: Intuitive drag-and-drop interface for building quantum circuits
- **Real-time Simulation**: Simulate quantum circuits and view measurement probabilities
- **Multiple Qubit Support**: Build circuits with 1-4 qubits
- **Interactive Results**: Toggle between simple and technical interpretations

### **AI-Powered Features**
- **Natural Language Circuit Generation**: Describe circuits in plain English
- **Google Gemini AI Integration**: Advanced AI-powered circuit creation
- **Smart Circuit Analysis**: AI analysis of circuit behavior and properties
- **Example Query Library**: Pre-built examples for common quantum algorithms

### **Qiskit Integration** 🆕
- **Automatic Code Generation**: Convert visual circuits to executable Python code
- **Qiskit Export**: Download or copy generated Qiskit code
- **Syntax Highlighting**: Beautiful code display with Python syntax highlighting
- **Circuit Statistics**: Gate counts, depth analysis, and performance metrics
- **Installation Instructions**: Built-in setup guides for Qiskit

### **Educational Features**
- **Algorithm Templates**: Pre-built circuits for common quantum algorithms
- **Grover's Search**: Interactive implementation of quantum search
- **Quantum Gate Library**: Complete set of fundamental quantum gates
- **Learning Resources**: Explanations and interpretations for all results

## 🛠️ Getting Started

### Prerequisites

- **Node.js 18+** 
- **Gemini API key** from [Google AI Studio](https://makersuite.google.com/app/apikey)

### Quick Installation

1. **Clone the repository:**
```bash
git clone <your-repo-url>
cd SpurHacks
```

2. **Install dependencies:**
```bash
npm install
```

3. **Set up environment variables:**
```bash
npm run setup-env
```

This creates a `.env.local` file with your Gemini API key. The file is automatically excluded from version control.

### Manual Environment Setup

If the setup script doesn't work, create a `.env.local` file manually:

```env
# Gemini API Configuration
NEXT_PUBLIC_GEMINI_API_KEY=your_actual_api_key_here
```

### Running the Application

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to start building quantum circuits!

## 📖 Usage Guide

### **Manual Circuit Building**
1. Switch to the **"Manual"** tab
2. Drag quantum gates from the palette to the circuit grid
3. Adjust qubit count using the dropdown
4. Click **"Run Quantum Circuit"** to simulate
5. View results and generated Qiskit code

### **AI-Powered Circuit Generation**
1. Switch to the **"AI"** tab
2. Type a description of your desired circuit
3. Click the **"✨"** button or press Enter
4. AI generates and displays the circuit automatically
5. Run simulation to see results

### **Qiskit Code Export**
1. Build any circuit (manual or AI-generated)
2. Scroll to the **"Qiskit Code"** section
3. **Copy** the code to clipboard or **Download** as `.py` file
4. Run the code in any Python environment with Qiskit installed

### **Example AI Queries**
- "Create a quantum coin flip"
- "Show me quantum entanglement"
- "Build a quantum search algorithm"
- "Demonstrate quantum interference"
- "Create a Bell state circuit"
- "Show me quantum teleportation"
- "Build a quantum random number generator"
- "Demonstrate quantum phase estimation"

## 🔧 Supported Quantum Gates

| Gate | Symbol | Description | Qiskit Method |
|------|--------|-------------|---------------|
| Hadamard | H | Creates superposition | `qc.h(qubit)` |
| Pauli-X | X | Bit flip (NOT gate) | `qc.x(qubit)` |
| Pauli-Y | Y | Y rotation | `qc.y(qubit)` |
| Pauli-Z | Z | Phase flip | `qc.z(qubit)` |
| CNOT | ⊕ | Controlled NOT | `qc.cx(control, target)` |
| Toffoli | CC⊕ | Controlled-Controlled-NOT | `qc.ccx(control1, control2, target)` |
| RX | RX | X rotation | `qc.rx(angle, qubit)` |
| RY | RY | Y rotation | `qc.ry(angle, qubit)` |
| Measure | 📊 | Measure qubit | `qc.measure(qubit, qubit)` |

## 📊 Generated Qiskit Code Example

```python
# Quantum Circuit: Bell State Circuit
# Generated from visual circuit builder

from qiskit import QuantumCircuit, Aer, execute
from qiskit.visualization import plot_histogram
import matplotlib.pyplot as plt
import numpy as np

# Create quantum circuit with 2 qubits and 2 classical bits
qc = QuantumCircuit(2, 2)

# Circuit gates:
# Step 1:
qc.h(0)  # Hadamard gate on qubit 0

# Step 2:
qc.cx(0, 1)  # CNOT: control=0, target=1

# Measure all qubits
qc.measure_all()

# Execute the circuit
backend = Aer.get_backend('qasm_simulator')
job = execute(qc, backend, shots=1000)
result = job.result()

# Get the results
counts = result.get_counts(qc)
print("Measurement Results:")
print(counts)

# Plot the histogram
plot_histogram(counts)
plt.show()
```

## 🔐 Security & Environment Variables

- **API keys** are stored in environment variables and never committed to version control
- **`.env.local`** file is automatically excluded via `.gitignore`
- **Server-side validation** ensures secure API calls
- **Production deployment** should use server-side only environment variables

See [ENVIRONMENT_SETUP.md](./ENVIRONMENT_SETUP.md) for detailed configuration information.

## 🧪 Testing & Development

### Browser Console Commands
```javascript
// Test AI integration
await window.testAI();

// Test Qiskit code generation
await window.testQiskit();

// Generate Qiskit code for current circuit
await window.generateQiskitCode(circuit, numQubits);

// Debug circuit data
window.debugCircuit(circuit);
```

### API Endpoints
- `GET /api/test-qiskit` - Test Qiskit code generation
- `POST /api/qiskit-code` - Generate Qiskit code from circuit
- `POST /api/ai-circuit` - AI-powered circuit generation

## 📚 Documentation

- **[AI Integration Guide](./AI_INTEGRATION.md)** - Detailed AI features and configuration
- **[Qiskit Integration Guide](./QISKIT_INTEGRATION.md)** - Qiskit code generation and export
- **[Environment Setup Guide](./ENVIRONMENT_SETUP.md)** - Environment variable configuration
- **[Setup Instructions](./SETUP_INSTRUCTIONS.md)** - Step-by-step setup guide

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect to [Vercel](https://vercel.com)
3. Add `NEXT_PUBLIC_GEMINI_API_KEY` environment variable
4. Deploy automatically

### Other Platforms
- **Netlify**: Add environment variables in dashboard
- **Railway**: Use Railway's environment variable system
- **Docker**: Build with environment variables

## 🎓 Learning Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Google AI Studio](https://makersuite.google.com/app/apikey)
- [Qiskit Documentation](https://qiskit.org/documentation/)
- [Quantum Computing Concepts](https://quantum-computing.ibm.com/composer/docs/iqx/guide/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- **Google Gemini AI** for powerful circuit generation
- **IBM Qiskit** for quantum computing framework
- **Next.js** for the amazing React framework
- **Quantum Computing Community** for educational resources

---

**Ready to explore quantum computing?** 🚀 Start building circuits at [http://localhost:3000](http://localhost:3000)!
