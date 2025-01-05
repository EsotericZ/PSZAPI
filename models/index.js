import Backlog from './Backlog.js';
import Collection from './Collection.js';
import Featured from './Featured.js';
import Game from './Game.js';
import User from './User.js';
import Wishlist from './Wishlist.js';

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

// Backlog Relationships
Backlog.belongsTo(Game, {
  foreignKey: 'gameId',
  as: 'game',
});

Backlog.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
});

Game.hasMany(Backlog, {
  foreignKey: 'gameId',
  as: 'backlogs',
});

User.hasMany(Backlog, {
  foreignKey: 'userId',
  as: 'backlogs',
});

// Wishlist Relationships
Wishlist.belongsTo(Game, {
  foreignKey: 'gameId',
  as: 'game',
});

Wishlist.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
});

Game.hasMany(Wishlist, {
  foreignKey: 'gameId',
  as: 'wishlists',
});

User.hasMany(Wishlist, {
  foreignKey: 'userId',
  as: 'wishlists',
});

export {
  Backlog,
  Collection,
  Featured,
  Game,
  User,
  Wishlist,
};