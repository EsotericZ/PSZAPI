import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/connection';

class Collection extends Model {}

Collection.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    psnId: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: "collection_user_game_unique",
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    image: {
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
    earnedTrophies: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: {},
    },
    trophies: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: [],
    },
    status: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
      unique: "collection_user_game_unique",
    },
    rating: {
      type: DataTypes.FLOAT,
      allowNull: true,
      validate: { min: 1, max: 10 },
    },
    year: {
      type: DataTypes.INTEGER,
    },
    goty: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: 'Collection',
    tableName: 'collection',
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ["userId", "psnId"],
      },
    ],
  }
);

export default Collection;