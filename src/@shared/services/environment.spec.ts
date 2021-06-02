import environmentSchema from '../json-schemas/environment.schema';
import { EnvironmentModel } from '../models/environment.model';
import EnvironmentService from './environment.service';

describe('Environment service', () => {
  it('should not validate environment', function () {
    const environmentService = new EnvironmentService<EnvironmentModel>();
    environmentService.validators = environmentSchema;
    environmentService.dotenvPath = '';
    expect(() => environmentService.loadEnvironment(true)).toThrow();
  });
  it('should validate environment', function () {
    const environmentService = new EnvironmentService<EnvironmentModel>();
    environmentService.validators = environmentSchema;
    environmentService.loadEnvironment(true);
    expect(environmentService.environment.NODE_ENV).toEqual('test');
    expect(environmentService.environment.PORT).toEqual('8080');
  });
});
