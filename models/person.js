const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  const Person = sequelize.define('Person', {
    email: {type:DataTypes.STRING, allowNull:false, unique:true, validate:{isEmail:true}},
    username: {type:DataTypes.STRING, allowNull:false, unique:true},
    password: {type:DataTypes.STRING, allowNull:false},
  }, {});
  Person.associate = function(models) {
    // associations can be defined here
    Person.hasMany(models.AuthToken);
  };

  Person.authenticate = async function(username, password)
  {
    const user = await Person.findOne({where:{username}});
    if (bcrypt.compareSync(password, user.password)) {
      return user.authorize();
    }
    throw new Error('invalid password');
  }

  Person.prototype.authorize = async function () {
    const { AuthToken } = sequelize.models;
    const user = this;

    const authToken = await AuthToken.generate(this.id);

    await user.addAuthToken(authToken);

    return { user, authToken }
  };


  Person.prototype.logout = async function (token) {
    sequelize.models.AuthToken.destroy({ where: { token } });
  };

  return Person;
};