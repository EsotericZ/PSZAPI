import Backlog from './Backlog.js';
import Collection from './Collection.js';
import Featured from './Featured.js';
import Game from './Game.js';
import Rating from './Rating.js';
import Review from './Review.js';
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

// Ratings Relationships
Rating.belongsTo(Game, {
  foreignKey: 'gameId',
  as: 'game',
});

Rating.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
});

Game.hasMany(Rating, {
  foreignKey: 'gameId',
  as: 'ratings',
});

User.hasMany(Rating, {
  foreignKey: 'userId',
  as: 'ratings',
});

// Reviews Relationships
Review.belongsTo(Game, {
  foreignKey: 'gameId',
  as: 'game',
});

Game.hasMany(Review, {
  foreignKey: 'gameId',
  as: 'reviews',
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
  Rating,
  Review,
  User,
  Wishlist,
};