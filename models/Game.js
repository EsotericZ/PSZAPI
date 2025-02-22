import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/connection.js';

class Game extends Model {}

Game.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    psnId: {
      type: DataTypes.STRING(100),
      allowNull: true,
      unique: true,
    },
    igdbId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    year: {
      type: DataTypes.INTEGER,
    },
    totalRating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    ratingCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    gotyCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    modelName: 'Game',
    tableName: 'games',
    timestamps: false,
  }
);

export default Game;