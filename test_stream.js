import { streamText } from 'ai';
import { groq } from '@ai-sdk/groq';

async function main() {
  const result = await streamText({
    model: groq('llama-3.3-70b-versatile'),
    messages: [{ role: 'user', content: 'test' }],
  });
  
  let props = [];
  let obj = result;
  do {
    props.push(...Object.getOwnPropertyNames(obj));
  } while (obj = Object.getPrototypeOf(obj));
  
  console.log(props.filter(p => typeof result[p] === 'function'));
  process.exit(0);
}
main();
