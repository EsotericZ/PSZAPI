import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/connection';

class Review extends Model {}

Review.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    rating: {
      type: DataTypes.FLOAT,
      allowNull: true,
      validate: { min: 1, max: 10 },
    },
    review: {
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
  },
  {
    sequelize,
    modelName: 'Review',
    tableName: 'reviews',
    timestamps: false,
  }
);

export default Review;