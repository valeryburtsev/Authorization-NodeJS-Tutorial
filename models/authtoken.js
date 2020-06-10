'use strict';
module.exports = (sequelize, DataTypes) => {
  const AuthToken = sequelize.define('AuthToken', {
    token: DataTypes.STRING
  }, {});
  AuthToken.associate = function(models) {
    // associations can be defined here
    AuthToken.belongsTo(models.Person);
  };

  AuthToken.generate = async function(PersonId)
  {
    if(!PersonId) throw new Error("AuthToken requires PersonId");

    let token = '';
    const possibleCharacters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' +
      'abcdefghijklmnopqrstuvwxyz0123456789';

    for (var i = 0; i < 45; i++) {
      token += possibleCharacters.charAt(
        Math.floor(Math.random() * possibleCharacters.length)
      );
    }

    return AuthToken.create({ token, PersonId })
  }
  return AuthToken;
};