import userResolvers from './User';

export default {
  Mutation: {
    ...userResolvers.mutations,
  },
};
