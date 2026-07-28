import { streamText } from 'ai';
import { groq } from '@ai-sdk/groq';
import { createDeepSeek } from '@ai-sdk/deepseek';
import { NextResponse } from 'next/server';
import { getProducts } from '@/lib/woocommerce';

// Initialize DeepSeek (Groq is auto-initialized if GROQ_API_KEY is in env)
const deepseek = createDeepSeek({
  apiKey: process.env.DEEPSEEK_API_KEY || '',
});

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    // 1. RAG: Fetch store inventory (Top 50 in-stock)
    // We only fetch a few fields to keep the prompt small
    const rawProducts = await getProducts(50, { 
      // Assuming getProducts handles basic queries, or we just get latest
    });
    
    // Filter and format for the AI (INCLUDE SLUG FOR URLS)
    const catalogSummary = rawProducts
      .filter((p: any) => p.stock_status === "instock")
      .map((p: any) => `- **[${p.name}](/product/${p.slug})** | ₦${p.price}`)
      .join('\n');

    const systemPrompt = `You are the exclusive Elvara Skinlane beauty consultant. 
Your tone is elegant, luxurious, deeply knowledgeable, and concise. 
Your goal is to provide highly converting, tailored recommendations.

CRITICAL INSTRUCTIONS:
1. You must ONLY recommend products from the following live catalog. Do NOT mention products not in the catalog.
2. ALWAYS use Markdown formatting to make your response highly readable.
3. When recommending a product, ALWAYS use the EXACT Markdown link format provided in the catalog. DO NOT use raw IDs like (ID: 138).
   Correct: **[Product Name](/product/slug)**
   Incorrect: Product Name (ID: 138)
4. Keep responses punchy and visually structured (use bullet points for recommendations). Max 3 short paragraphs.
5. Focus on the benefits of the product to make the user want to buy it immediately.

LIVE IN-STOCK CATALOG:
${catalogSummary}

When a user asks for a recommendation, ask clarifying questions if needed (e.g., skin type, concerns), but always try to offer an immediate recommendation from the catalog if possible.`;

    // Map UIMessage to CoreMessage (extracting text from parts)
    const coreMessages = messages.map((m: any) => ({
      role: m.role,
      content: m.parts ? m.parts.map((p: any) => p.type === 'text' ? p.text : '').join('') : (m.content || ''),
    }));

    // 2. Multi-tier Cloud Fallback (Groq -> DeepSeek)
    let result;
    try {
      result = await streamText({
        model: groq('llama-3.3-70b-versatile') as any,
        system: systemPrompt,
        messages: coreMessages,
        temperature: 0.7,
      });
    } catch (groqError: any) {
      console.warn("Groq failed, trying DeepSeek...", groqError?.message);
      result = await streamText({
        model: deepseek('deepseek-chat') as any,
        system: systemPrompt,
        messages: coreMessages,
        temperature: 0.7,
      });
    }

    return (result as any).toUIMessageStreamResponse 
      ? (result as any).toUIMessageStreamResponse() 
      : (result as any).toTextStreamResponse();
    
  } catch (error: any) {
    console.error("Cloud Assistant Error:", error);
    
    // 3. If both cloud providers fail, signal the frontend to use the local WebGPU fallback
    return NextResponse.json(
      { error: 'primary_engine_exhausted', fallback_required: true }, 
      { status: 429 }
    );
  }
}
