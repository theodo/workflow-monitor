import userResolvers from './User';
import projectResolvers from './Projects';

export default {
  Project: {
    ...projectResolvers.queries,
  },
  Mutation: {
    ...userResolvers.mutations,
  },
};
