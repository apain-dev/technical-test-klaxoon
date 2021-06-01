import { Logger } from '@nestjs/common';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import { Schema, Validator } from 'jsonschema';
import { Subject } from 'rxjs';
import EnvStatus from '../models/environment.model';

class EnvironmentService<T> {
  public dotenvPath = '.env';

  public environmentReady$ = new Subject();

  private validator;

  /**
   * @description Initialize environment handler
   */
  constructor() {
    this.validator = new Validator();
    if (process.env?.NODE_ENV === 'test') {
      this.dotenvPath = '.env.test';
    }
  }

  // tslint:disable-next-line:variable-name
  private _environment: NodeJS.ProcessEnv & T = {} as any;

  public get environment(): NodeJS.ProcessEnv & T {
    return this._environment;
  }

  public set environment(value: NodeJS.ProcessEnv & T) {
    this._environment = value;
  }

  // tslint:disable-next-line:variable-name
  private _validators: Schema = {};

  public get validators(): Schema {
    return this._validators;
  }

  /**
   * @param value custom validators for environment
   * @description register validators for environment
   */
  public set validators(value: Schema) {
    this._validators = value;
  }

  /**
   * @description return current environment status
   */
  static getEnvStatus(): EnvStatus {
    switch (process.env.NODE_ENV) {
      case 'production':
        return EnvStatus.PRODUCTION;
      case 'staging':
        return EnvStatus.STAGING;
      case 'test':
        return EnvStatus.TEST;
      default:
        return EnvStatus.LOCAL;
    }
  }

  /**
   * @description load environment and validate it if required
   * @param validateEnvironment enable validation
   * @param customEnvironment custom environment to be added
   * @throws Error indicate environment verification failed
   */
  public loadEnvironment(
    validateEnvironment = false,
    customEnvironment: Partial<T> = {},
  ): NodeJS.ProcessEnv & T {
    if (!this.loadDotenv()) {
      Logger.debug('No environment found. Using default', 'Environment');
    }
    this.loadDefaultEnvironment();
    this.loadCustomEnv(customEnvironment);
    if (validateEnvironment) {
      if (!this.validateEnvironment()) {
        throw new Error('Invalid environment');
      }
    }
    this.environmentReady$.next();
    return this.environment;
  }

  /**
   * @description validate environment. You need to provide a schema of
   * environment. please see validators()
   */
  public validateEnvironment(): boolean {
    const bodyValidation = this.validator.validate(this.environment, this._validators, true);
    if (bodyValidation.errors.length) {
      Logger.error(
        'Environment validation failed',
        JSON.stringify(bodyValidation.errors),
        'Environment',
      );
      return false;
    }
    return true;
  }

  /**
   *
   * @param custom custom object containing property to be checked in environment
   * @description Append custom properties to validators
   */
  public loadCustomEnv(custom: Partial<T>): boolean {
    this._environment = { ...custom, ...this._environment };
    return Object.keys(custom).length > 0;
  }

  private loadDotenv(): boolean {
    if (fs.existsSync(this.dotenvPath)) {
      Logger.debug('Using .env file to supply config environment variables', 'Environment');
      const output = dotenv.config({ path: this.dotenvPath });
      if (output.error) {
        Logger.error('An error occurred during loading of .env file', '', 'Environment');
        return false;
      }
      return true;
    }
    return false;
  }

  private loadDefaultEnvironment() {
    this._environment = { ...this._environment, ...process.env };
  }
}

export default EnvironmentService;
