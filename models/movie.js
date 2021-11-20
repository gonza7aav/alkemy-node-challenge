/* eslint-disable strict */

'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Movie extends Model {
    static associate({ Character, Genre }) {
      this.belongsToMany(Character, {
        through: 'movie_character',
        timestamps: false,
      });

      this.belongsToMany(Genre, {
        through: 'genre_movie',
        timestamps: false,
      });
    }
  }
  Movie.init(
    {
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      image: { type: DataTypes.BLOB },
      creationDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      score: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Movie',
      tableName: 'movies',
      timestamps: false,
    }
  );
  return Movie;
};
