module.exports = {
  Query: {
    hello: (_, args, { user }) => `Hello ${user.fullName || 'World'}`,
    currentUser: (_, args, { user }) => user,
  },
};
