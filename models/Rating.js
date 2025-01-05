import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/connection';

class Rating extends Model {}

Rating.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    userRating: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    userReview: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    goty: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
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
    modelName: 'Rating',
    tableName: 'ratings',
    timestamps: false,
  }
);

export default Rating;