export enum EnvStatus {
  TEST,
  PRODUCTION = 'production',
  STAGING = 'staging',
  LOCAL = 'local',
}

export interface EnvironmentModel {
  PORT: string;

  MONGO_DATABASE: string;

  URL: string;
}

export default EnvStatus;
