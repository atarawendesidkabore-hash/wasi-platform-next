import Anthropic from "@anthropic-ai/sdk";
import { assertAnthropicEnv } from "@/lib/env";

let client: Anthropic | null = null;

export function createAnthropicClient() {
  if (client) {
    return client;
  }

  client = new Anthropic({
    apiKey: assertAnthropicEnv().apiKey
  });

  return client;
}
