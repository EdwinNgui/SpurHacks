// Dynamic import to avoid SSR issues
let Client: any = null;

export interface QuantumLLMResponse {
  success: boolean;
  data?: any;
  error?: string;
}

export class HuggingFaceQuantumAPI {
  private client: any = null;
  private isInitialized = false;

  async initialize(): Promise<boolean> {
    // Check if we're in a browser environment
    if (typeof window === 'undefined') {
      console.warn('HuggingFace API cannot be initialized on the server side');
      return false;
    }

    try {
      // Dynamically import the client
      if (!Client) {
        const module = await import("@gradio/client");
        Client = module.Client;
      }
      
      this.client = await Client.connect("BoltzmannEntropy/QuantumLLMInstruct");
      this.isInitialized = true;
      return true;
    } catch (error) {
      console.error("Failed to initialize HuggingFace API client:", error);
      return false;
    }
  }

  async reloadModel(modelName: string = "Qwen/Qwen2.5-Coder-1.5B-Instruct"): Promise<QuantumLLMResponse> {
    if (typeof window === 'undefined') {
      return { success: false, error: "API not available on server side" };
    }

    if (!this.isInitialized || !this.client) {
      const initialized = await this.initialize();
      if (!initialized) {
        return { success: false, error: "Failed to initialize API client" };
      }
    }

    try {
      const result = await this.client!.predict("/reload_model", {
        model_name: modelName,
      });
      return { success: true, data: result.data };
    } catch (error) {
      console.error("Error reloading model:", error);
      return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
    }
  }

  async generateAndDisplay(
    numPairs: string = "1",
    selectedDomains: string[] = ["QASM Generation"]
  ): Promise<QuantumLLMResponse> {
    if (typeof window === 'undefined') {
      return { success: false, error: "API not available on server side" };
    }

    if (!this.isInitialized || !this.client) {
      const initialized = await this.initialize();
      if (!initialized) {
        return { success: false, error: "Failed to initialize API client" };
      }
    }

    try {
      const result = await this.client!.predict("/generate_and_display", {
        num_pairs: numPairs,
        selected_domains: selectedDomains,
      });
      return { success: true, data: result.data };
    } catch (error) {
      console.error("Error generating and displaying:", error);
      return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
    }
  }

  async generateSolutions(
    solutionModelName: string = "Qwen/Qwen2.5-Coder-1.5B-Instruct"
  ): Promise<QuantumLLMResponse> {
    if (typeof window === 'undefined') {
      return { success: false, error: "API not available on server side" };
    }

    if (!this.isInitialized || !this.client) {
      const initialized = await this.initialize();
      if (!initialized) {
        return { success: false, error: "Failed to initialize API client" };
      }
    }

    try {
      const result = await this.client!.predict("/generate_solutions", {
        solution_model_name: solutionModelName,
      });
      return { success: true, data: result.data };
    } catch (error) {
      console.error("Error generating solutions:", error);
      return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
    }
  }

  async loadSummaryFromDuckDB(): Promise<QuantumLLMResponse> {
    if (typeof window === 'undefined') {
      return { success: false, error: "API not available on server side" };
    }

    if (!this.isInitialized || !this.client) {
      const initialized = await this.initialize();
      if (!initialized) {
        return { success: false, error: "Failed to initialize API client" };
      }
    }

    try {
      const result = await this.client!.predict("/load_summary_from_duckdb", {});
      return { success: true, data: result.data };
    } catch (error) {
      console.error("Error loading summary from DuckDB:", error);
      return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
    }
  }

  async viewDBData(): Promise<QuantumLLMResponse> {
    if (typeof window === 'undefined') {
      return { success: false, error: "API not available on server side" };
    }

    if (!this.isInitialized || !this.client) {
      const initialized = await this.initialize();
      if (!initialized) {
        return { success: false, error: "Failed to initialize API client" };
      }
    }

    try {
      const result = await this.client!.predict("/view_db_data", {});
      return { success: true, data: result.data };
    } catch (error) {
      console.error("Error viewing DB data:", error);
      return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
    }
  }

  async exportParquet(dbFile: string = "quantum_problems.duckdb"): Promise<QuantumLLMResponse> {
    if (typeof window === 'undefined') {
      return { success: false, error: "API not available on server side" };
    }

    if (!this.isInitialized || !this.client) {
      const initialized = await this.initialize();
      if (!initialized) {
        return { success: false, error: "Failed to initialize API client" };
      }
    }

    try {
      const result = await this.client!.predict("/export_parquet", {
        db_file: dbFile,
      });
      return { success: true, data: result.data };
    } catch (error) {
      console.error("Error exporting parquet:", error);
      return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
    }
  }

  // Helper method to process user queries and generate quantum circuits
  async processQuantumQuery(userQuery: string): Promise<QuantumLLMResponse> {
    if (typeof window === 'undefined') {
      return { success: false, error: "API not available on server side" };
    }

    // Map user queries to appropriate domains
    const queryToDomains: { [key: string]: string[] } = {
      'entangle': ['Entanglement and Quantum Information Theory', 'Bell State and Concurrence'],
      'bell': ['Bell State and Concurrence', 'Bell Inequalities and Nonlocality'],
      'superposition': ['Quantum Gates', 'Superposition Principle'],
      'coin flip': ['Quantum Probability Calculations'],
      'search': ['Quantum Algorithm Development', 'Quantum Phase Estimation'],
      'grover': ['Quantum Algorithm Development'],
      'interference': ['Quantum Interference', 'Wave-Particle Duality'],
      'teleport': ['Quantum Communication Protocols', 'Quantum Teleportation'],
      'factor': ['Quantum Algorithm Development'],
      'shor': ['Quantum Algorithm Development'],
      'circuit': ['QASM Generation', 'PennyLane Quantum Circuits'],
      'measure': ['Quantum Measurement', 'Measurement in Qubit Basis'],
      'hamiltonian': ['Quantum Hamiltonians', 'Building Molecular Hamiltonian'],
      'vqe': ['Variational Quantum Eigensolver (VQE)', 'VQE Analysis'],
      'qaoa': ['Quantum Approximation Optimization Algorithm (QAOA)'],
      'fourier': ['Quantum Fourier Transform'],
      'error': ['Quantum Error Correction'],
      'cryptography': ['Quantum Cryptography'],
      'machine learning': ['Quantum Machine Learning'],
      'tomography': ['Quantum State Tomography'],
    };

    // Find matching domains based on user query
    const lowerQuery = userQuery.toLowerCase();
    let selectedDomains = ['QASM Generation']; // Default domain

    for (const [keyword, domains] of Object.entries(queryToDomains)) {
      if (lowerQuery.includes(keyword)) {
        selectedDomains = domains;
        break;
      }
    }

    // Generate quantum problems using the API
    return await this.generateAndDisplay("1", selectedDomains);
  }
}

// Export a singleton instance
export const huggingFaceAPI = new HuggingFaceQuantumAPI(); 