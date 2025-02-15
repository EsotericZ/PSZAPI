import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/connection.js';

class User extends Model {}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(100),
      unique: true,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    psn: {
      type: DataTypes.STRING(100),
      unique: true,      
    },
    role: {
      type: DataTypes.INTEGER,
      defaultValue: 2001,
    },
    verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    verifyCode: {
      type: DataTypes.STRING,
      validate: {
        len: [6, 6],
      },
    },
    psnAccountId: {
      type: DataTypes.STRING(255),
    },
    psnAvatar: {
      type: DataTypes.STRING(255),
      validate: {
        isUrl: true,
      },
    },
    psnPlus: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    trophies: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: {},
    },
    firstTime: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    announcement: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    accountLevel: {
      type: DataTypes.ENUM('standard', 'premium'),
      defaultValue: 'standard',
      allowNull: false,
    },
    lastApiRequestStandard: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    lastApiRequestPremium: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: true,
  }
);

export default User;