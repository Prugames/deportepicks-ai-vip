import dotenv from 'dotenv';
dotenv.config();

export const CONFIG = {
  PORT: process.env.PORT || 5000,
  OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY || '',
  OPENROUTER_BASE_URL: 'https://openrouter.ai/api/v1',
  DEFAULT_MODEL: 'z-ai/glm-5.2:free',
  FALLBACK_MODELS: [
    'openrouter/free',
    'nvidia/nemotron-3.5-lightning:free',
    'google/gemma-4-31b-it:free',
    'minimax/minimax-m3:free',
  ],
  MASTER_ADMIN_CODE: 'DeportePicks',
  APP_NAME: 'DeportePicks AI VIP',
  APP_URL: 'https://deportepicks.ai'
};
