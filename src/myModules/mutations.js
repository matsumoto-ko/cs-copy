const registerUsernameGlobally = function (username) {
  this.$store.commit("RegisterUsernameGlobally", username);
};

export default registerUsernameGlobally;
