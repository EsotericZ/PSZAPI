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

export {
  Featured,
  Game,
  User,
};