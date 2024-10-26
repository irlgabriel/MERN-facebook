declare namespace NodeJS {
  export interface ProcessEnv {
    DB_STRING: string;
    FACEBOOK_APP_ID: string;
    FACEBOOK_APP_SECRET: string;
    FRONTEND_URL: string;
    JWT_SECRET: string;
    NODE_ENV: string;
  }
}
