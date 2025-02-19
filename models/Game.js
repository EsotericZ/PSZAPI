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
    gameId: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    year: {
      type: DataTypes.INTEGER,
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