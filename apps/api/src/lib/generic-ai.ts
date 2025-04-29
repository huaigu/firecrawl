import { createOpenAI } from "@ai-sdk/openai";
import { logger as baseLogger } from "./logger";

const logger = {
  ...baseLogger,
  info: (message: string, meta?: any) => baseLogger.info({ message, ...meta }),
  error: (message: string, meta?: any) => baseLogger.error({ message, ...meta })
};

type Provider = "openai";

// 强制使用自定义的OpenAI兼容服务
const defaultProvider: Provider = "openai";

// Debug环境变量
logger.info('Compatible API Configuration:', {
  module: 'generic-ai',
  method: 'initialization',
  config: {
    COMPATIBLE_API_BASE_URL: process.env.COMPATIBLE_API_BASE_URL,
    COMPATIBLE_API_KEY: process.env.COMPATIBLE_API_KEY ? '***' + process.env.COMPATIBLE_API_KEY.slice(-4) : undefined,
    COMPATIBLE_LARGE_MODEL_NAME: process.env.COMPATIBLE_LARGE_MODEL_NAME,
    COMPATIBLE_SMALL_MODEL_NAME: process.env.COMPATIBLE_SMALL_MODEL_NAME,
  }
});

// 检查必要的环境变量
if (process.env.COMPATIBLE_API_BASE_URL && !process.env.COMPATIBLE_API_KEY) {
  logger.error('COMPATIBLE_API_KEY is missing but COMPATIBLE_API_BASE_URL is set', {
    module: 'generic-ai',
    method: 'initialization',
  });
  throw new Error('COMPATIBLE_API_KEY is required when COMPATIBLE_API_BASE_URL is set');
}

const openAIClient = createOpenAI({
  apiKey: process.env.COMPATIBLE_API_KEY || process.env.OPENAI_API_KEY,
  baseURL: process.env.COMPATIBLE_API_BASE_URL,
  headers: process.env.COMPATIBLE_API_KEY ? {
    'Authorization': `Bearer ${process.env.COMPATIBLE_API_KEY}`
  } : undefined
});

export function getModel(name: string) {
  // 记录环境变量值
  logger.info('Compatible API Configuration:', {
    baseURL: process.env.COMPATIBLE_API_BASE_URL,
    apiKey: process.env.COMPATIBLE_API_KEY ? '****' + process.env.COMPATIBLE_API_KEY.slice(-4) : undefined,
    modelName: name
  });

  if (process.env.COMPATIBLE_API_BASE_URL && !process.env.COMPATIBLE_API_KEY) {
    logger.error('COMPATIBLE_API_KEY is required when COMPATIBLE_API_BASE_URL is set');
    throw new Error('COMPATIBLE_API_KEY is required when COMPATIBLE_API_BASE_URL is set');
  }

  return openAIClient;
}

export function getEmbeddingModel(name: string, provider: Provider = defaultProvider) {
  const modelName = process.env.MODEL_EMBEDDING_NAME || name;
  return openAIClient.embedding(modelName);
}
