const logout = (req, res) => {
  res
    .clearCookie('jwt')
    .status(200)
    .send({ message: 'Выход выполнен' });
};

module.exports = {
  logout,
};
