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


// Featured to Game Relationships
Featured.belongsTo(IGDB, { 
  foreignKey: 'igdbId', 
  as: 'game' 
});

IGDB.hasMany(Featured, { 
  foreignKey: 'igdbId', 
  as: 'featured' 
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
Collection.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
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

// Friends Relationships
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