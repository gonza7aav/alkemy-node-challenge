/* eslint-disable strict */

'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Genre extends Model {
    static associate({ Movie }) {
      this.belongsToMany(Movie, {
        through: 'genre_movie',
        timestamps: false,
      });
    }
  }
  Genre.init(
    {
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      image: { type: DataTypes.BLOB },
    },
    {
      sequelize,
      modelName: 'Genre',
      tableName: 'genres',
      timestamps: false,
    }
  );
  return Genre;
};
