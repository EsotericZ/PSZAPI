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
    colorDom: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    colorSat: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    esrb: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    gameId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    metacritic: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    rating: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    ratingTop: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    released: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING(255),
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