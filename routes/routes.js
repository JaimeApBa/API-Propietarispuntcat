const express = require('express');
const app = express();
require('dotenv').config();

// ==================================
// Import all API routes
// ==================================
var login = require('../services/login');
var community = require('../services/community');
var communities = require('../services/communities');
var joinCommunity = require('../services/joinCommunity');
var user = require('../services/user');

// ==================================
// Using routes
// ==================================
app.use('/login', login);
app.use('/user', user);
app.use('/community', community);
app.use('/communities', communities);
app.use('/joinCommunity', joinCommunity);

module.exports = app;