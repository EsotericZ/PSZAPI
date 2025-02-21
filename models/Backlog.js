import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/connection';

class Backlog extends Model {}

Backlog.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    gameId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'games',
        key: 'id',
      },
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
  },
  {
    sequelize,
    modelName: 'Backlog',
    tableName: 'backlog',
    timestamps: false,
  }
);

export default Backlog;