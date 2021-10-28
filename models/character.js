'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Character extends Model {
    static associate({ Movie }) {
      this.belongsToMany(Movie, {
        through: 'movie_character',
        timestamps: false,
      });
    }
  }
  Character.init(
    {
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      image: { type: DataTypes.BLOB },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      age: { type: DataTypes.INTEGER },
      weight: { type: DataTypes.FLOAT },
      history: { type: DataTypes.TEXT },
    },
    {
      sequelize,
      modelName: 'Character',
      tableName: 'characters',
      timestamps: false,
    }
  );
  return Character;
};
