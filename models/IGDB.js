import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/connection.js';

class IGDB extends Model {}

IGDB.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    gameId: { 
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    cover: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    esrb: { 
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    rating: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    released: { 
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    slug: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    genres: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    storyline: { 
      type: DataTypes.TEXT,
      allowNull: true,
    },
    summary: { 
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'IGDB',
    tableName: 'igdb',
    timestamps: false,
  }
);

export default IGDB;