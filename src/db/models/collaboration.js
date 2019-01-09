'use strict';
module.exports = (sequelize, DataTypes) => {
  var Collaboration = sequelize.define('Collaboration', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    wikiId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {});
  Collaboration.associate = function(models) {
    // associations can be defined here
    Collaboration.belongsTo(models.User, {
        foreignKey: "userId",
        onDelete: "CASCADE"
    });

    Collaboration.belongsTo(models.Wiki, {
      foreignKey: "wikiId",
      onDelete: "CASCADE"
    });
  };
  return Collaboration;
};