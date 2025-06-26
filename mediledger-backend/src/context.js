module.exports = ({ req }) => {
  return {
    token: req.headers.authorization || "",
  };
};
