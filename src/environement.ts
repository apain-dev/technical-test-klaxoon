import { EnvironmentModel } from './@shared/models/environment.model';
import envSchema from './@shared/json-schemas/environment.schema';
import EnvironmentService from './@shared/services/environment.service';

const environmentHandler = new EnvironmentService<EnvironmentModel>();
environmentHandler.validators = envSchema;
environmentHandler.loadEnvironment(true);
export default environmentHandler;
