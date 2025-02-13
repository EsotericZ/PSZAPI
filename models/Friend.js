import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/connection.js';
import User from './index.js';

class Friend extends Model {}

Friend.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
    psnAccountId: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    avatarUrl: {
      type: DataTypes.STRING(255),
      validate: {
        isUrl: true,
      },
    },
    pszUser: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: 'Friend',
    tableName: 'friends',
    timestamps: false,
    uniqueKeys: {
      uniqueFriend: {
        fields: ['userId', 'psnAccountId'],
      },
    },
  }
);

export default Friend;