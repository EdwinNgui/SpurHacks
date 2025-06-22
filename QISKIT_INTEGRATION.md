# Qiskit Integration

This document describes the Qiskit integration feature that automatically generates Python code from your visual quantum circuits.

## Overview

The Qiskit integration allows users to:
- Generate executable Python code from any circuit built in the visual interface
- Download the generated code as `.py` files
- Copy code to clipboard for easy sharing
- View installation instructions for Qiskit
- Get circuit analysis and statistics

## Features

### 1. Automatic Code Generation
- Converts visual circuit representation to Qiskit Python code
- Supports all gate types: H, X, Y, Z, CNOT, CCNOT, RX, RY, RZ, MEASURE
- Maintains proper gate ordering and timing
- Includes comprehensive comments and documentation

### 2. Code Display
- Syntax highlighting for Python code
- Collapsible sections for installation instructions
- Advanced mode with additional circuit analysis
- Responsive design with scrollable code blocks

### 3. Export Options
- **Copy to Clipboard**: One-click copying of generated code
- **Download**: Save code as Python file with descriptive filename
- **Installation Instructions**: Separate copy/download for setup commands

### 4. Circuit Analysis
- Automatic circuit naming based on gate patterns
- Gate count statistics
- Circuit depth calculation
- Performance metrics

## Generated Code Structure

The generated Qiskit code includes:

```python
# Imports
from qiskit import QuantumCircuit, Aer, execute
from qiskit.visualization import plot_histogram
import matplotlib.pyplot as plt
import numpy as np

# Circuit creation
qc = QuantumCircuit(num_qubits, num_qubits)

# Gate operations (organized by time steps)
qc.h(0)  # Hadamard gate on qubit 0
qc.cx(0, 1)  # CNOT: control=0, target=1

# Measurement and execution
qc.measure_all()
backend = Aer.get_backend('qasm_simulator')
job = execute(qc, backend, shots=1000)
result = job.result()
counts = result.get_counts(qc)

# Visualization
plot_histogram(counts)
plt.show()
```

## API Endpoints

### POST `/api/qiskit-code`
Generates Qiskit code from circuit data.

**Request Body:**
```json
{
  "circuit": [
    {
      "id": 1,
      "type": "H",
      "qubit": 0,
      "position": 0
    }
  ],
  "numQubits": 2,
  "advanced": false
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "code": "# Generated Python code...",
    "explanation": "Circuit explanation...",
    "circuitName": "Bell State Circuit",
    "installationInstructions": "# Installation commands...",
    "circuitStats": {
      "totalGates": 4,
      "gateTypes": { "H": 1, "CNOT": 1, "MEASURE": 2 },
      "maxPosition": 3
    }
  }
}
```

### GET `/api/test-qiskit`
Test endpoint that generates sample Qiskit code for a Bell state circuit.

## Installation

To use the generated Qiskit code:

1. **Install Qiskit:**
   ```bash
   pip install qiskit
   ```

2. **Install visualization dependencies:**
   ```bash
   pip install matplotlib
   pip install qiskit[visualization]
   ```

3. **Optional - Jupyter for notebooks:**
   ```bash
   pip install jupyter
   ```

## Usage Examples

### Bell State Circuit
```python
# Generated from visual circuit with H gate on qubit 0 and CNOT(0,1)
qc = QuantumCircuit(2, 2)
qc.h(0)  # Hadamard gate on qubit 0
qc.cx(0, 1)  # CNOT: control=0, target=1
qc.measure_all()
```

### Quantum Superposition
```python
# Generated from visual circuit with H gate only
qc = QuantumCircuit(1, 1)
qc.h(0)  # Hadamard gate on qubit 0
qc.measure_all()
```

### Quantum Interference
```python
# Generated from visual circuit with H-Z-H sequence
qc = QuantumCircuit(1, 1)
qc.h(0)  # Hadamard gate on qubit 0
qc.z(0)  # Pauli-Z gate on qubit 0
qc.h(0)  # Hadamard gate on qubit 0
qc.measure_all()
```

## Development

### Testing
Use the browser console to test the integration:

```javascript
// Test Qiskit code generation
await window.testQiskit();

// Generate code for current circuit
await window.generateQiskitCode(circuit, numQubits);
```

### Adding New Gate Types
To support new gate types, update the `generateGateCode` method in `QiskitCodeGenerator`:

```typescript
case 'NEW_GATE':
  return `qc.new_gate(${gate.qubit})  # New gate on qubit ${gate.qubit}`;
```

### Customizing Code Generation
Modify the `QiskitCodeGenerator` class to:
- Add custom imports
- Include additional analysis
- Generate different code formats
- Add circuit optimization

## Troubleshooting

### Common Issues

1. **Empty Circuit Error**
   - Ensure the circuit has at least one gate
   - Check that gate positions are valid

2. **Invalid Gate Types**
   - Verify all gates have valid types
   - Check gate parameter validation

3. **Code Generation Fails**
   - Check browser console for errors
   - Verify API endpoint is accessible
   - Ensure circuit data is properly formatted

### Debug Commands
```javascript
// Debug current circuit
window.debugCircuit(circuit);

// Test API endpoints
await window.testQiskit();
await window.generateQiskitCode(circuit, numQubits);
```

## Future Enhancements

- [ ] Support for custom gate definitions
- [ ] Circuit optimization suggestions
- [ ] Multiple output formats (OpenQASM, Q#)
- [ ] Real-time code preview
- [ ] Circuit validation and error checking
- [ ] Integration with IBM Quantum Experience
- [ ] Support for parameterized circuits
- [ ] Circuit comparison and analysis tools 