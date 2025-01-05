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
    psnName: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    psnIcon: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    progress: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    platinum: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    status: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    userRating: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    userComments: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    order: {
      type: DataTypes.INTEGER,
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