declare module '@gradio/client' {
  export class Client {
    static connect(endpoint: string): Promise<Client>;
    predict(apiName: string, params: any): Promise<{ data: any }>;
  }
} 