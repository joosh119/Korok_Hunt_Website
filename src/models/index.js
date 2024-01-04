// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { User, Korok } = initSchema(schema);

export {
  User,
  Korok
};