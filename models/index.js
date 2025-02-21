import Backlog from './Backlog.js';
import Collection from './Collection.js';
import Featured from './Featured.js';
import Friend from './Friend.js';
import Game from './Game.js';
import IGDB from './IGDB.js';
import Review from './Review.js';
import User from './User.js';
import Wishlist from './Wishlist.js';

// Game <-> IGDB (One-to-One Relationship)
Game.belongsTo(IGDB, { 
  foreignKey: 'igdbId', 
  targetKey: 'igdbId',
  as: 'igdb',
});

IGDB.hasOne(Game, { 
  foreignKey: 'igdbId', 
  sourceKey: 'igdbId',
  as: 'game',
});

// Game ↔ Collection (One-to-Many Relationship)
Game.hasMany(Collection, { 
  foreignKey: 'psnId', 
  sourceKey: 'psnId', 
  as: 'collections',
});

Collection.belongsTo(Game, { 
  foreignKey: 'psnId', 
  targetKey: 'psnId', 
  as: 'game',
});

// Featured ↔ IGDB (One-to-Many Relationship)
Featured.belongsTo(IGDB, { 
  foreignKey: 'igdbId', 
  as: 'game' 
});

IGDB.hasMany(Featured, { 
  foreignKey: 'igdbId', 
  as: 'featured' 
});

// Game ↔ Reviews (One-to-Many Relationship)
Review.belongsTo(Game, {
  foreignKey: 'gameId',
  as: 'game',
});

Game.hasMany(Review, {
  foreignKey: 'gameId',
  as: 'reviews',
});

// Collection ↔ User (One-to-Many Relationship)
Collection.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
});

User.hasMany(Collection, {
  foreignKey: 'userId',
  as: 'collections',
});

// Backlog ↔ Game & User (One-to-Many Relationship)
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

// Wishlist ↔ Game & User (One-to-Many Relationship)
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

// User ↔ Friends (One-to-Many Relationship)
User.hasMany(Friend, {
  foreignKey: "userId",
  as: "friends",
});

Friend.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

export {
  Backlog,
  Collection,
  Featured,
  Friend,
  Game,
  IGDB,
  Review,
  User,
  Wishlist,
};