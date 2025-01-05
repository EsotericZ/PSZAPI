import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/connection.js';

class Featured extends Model {}

Featured.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,  
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
  },
  {
    sequelize,
    modelName: 'Featured',
    tableName: 'featured',
    timestamps: true,
  }
);

export default Featured;