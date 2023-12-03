declare namespace NodeJS {
  export interface ProcessEnv {
    DB_STRING: string;
    AWS_ACCESS_KEY_ID: string;
    AWS_BUCKET: string;
    AWS_SECRET_ACCESS_KEY: string;
    FACEBOOK_APP_ID: string;
    FACEBOOK_APP_SECRET: string;
    FRONTEND_URL: string;
    JWT_SECRET: string;
    NODE_ENV: string;
  }
}
