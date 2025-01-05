import Collection from './Collection.js';
import Featured from './Featured.js';
import Game from './Game.js';
import User from './User.js';

// Featured to Game Relationships
Featured.belongsTo(Game, { 
  foreignKey: 'gameId', 
  as: 'game' 
});

Game.hasMany(Featured, { 
  foreignKey: 'gameId', 
  as: 'featured' 
});

// Collection Relationships
Collection.belongsTo(Game, {
  foreignKey: 'gameId',
  as: 'game',
});

Collection.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
});

Game.hasMany(Collection, {
  foreignKey: 'gameId',
  as: 'collections',
});

User.hasMany(Collection, {
  foreignKey: 'userId',
  as: 'collections',
});

export {
  Collection,
  Featured,
  Game,
  User,
};