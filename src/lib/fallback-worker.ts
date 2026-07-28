import { pipeline } from '@huggingface/transformers';

class FallbackPipeline {
  static task: any = 'text-generation';
  // SmolLM-135M is very lightweight (~100MB) and optimized for rapid local fallback
  static model = 'HuggingFaceTB/SmolLM-135M-Instruct';
  static instance: any = null;

  static async getInstance(progress_callback: any) {
    if (this.instance === null) {
      try {
        this.instance = await pipeline(this.task, this.model, { 
          dtype: "q4", // 4-bit quantization reduces memory footprint
          device: "webgpu", // Attempt hardware acceleration first
          progress_callback 
        });
      } catch (err) {
        console.warn("WebGPU fallback failed, trying WASM...", err);
        // Fallback to WebAssembly if WebGPU is not supported
        this.instance = await pipeline(this.task, this.model, { 
          dtype: "q4", 
          device: "wasm", 
          progress_callback 
        });
      }
    }
    return this.instance;
  }
}

// Handle incoming messages from the React component
self.addEventListener('message', async (event) => {
  const { messages } = event.data;
  
  try {
    // 1. Initialize the model and stream download progress back to UI
    const generator = await FallbackPipeline.getInstance((progressData: any) => {
      self.postMessage({ type: 'progress', data: progressData });
    });

    // 2. We need to format the messages array into a prompt string for SmolLM
    // SmolLM-135M-Instruct uses ChatML format typically: <|im_start|>user\nHello<|im_end|>\n<|im_start|>assistant\n
    let prompt = "";
    for (const msg of messages) {
      prompt += `<|im_start|>${msg.role}\n${msg.content}<|im_end|>\n`;
    }
    prompt += `<|im_start|>assistant\n`;

    // 3. Generate response locally
    const output = await generator(prompt, { 
      max_new_tokens: 150,
      temperature: 0.6,
      do_sample: true
    });
    
    // 4. Extract generated text
    let generatedText = output[0].generated_text.replace(prompt, "");
    
    // Clean up trailing tags if any
    generatedText = generatedText.split('<|im_end|>')[0].trim();

    self.postMessage({ type: 'complete', output: generatedText });
  } catch (err: any) {
    console.error("Local Web Worker Error:", err);
    self.postMessage({ type: 'error', error: err.message });
  }
});
