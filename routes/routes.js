const express = require('express');
const app = express();
require('dotenv').config();

// ==================================
// Import all API routes
// ==================================
var login = require('../services/user/login');
var user = require('../services/user/user');
var password = require('../services/user/password');
var community = require('../services/community/community');
var communities = require('../services/community/communities');
var joinCommunity = require('../services/community/joinCommunity');
var pendingAccess = require('../services/community/pendingAccess');
var requestAccessCommunity = require('../services/community/requestAccess');
var changeRoleUser = require('../services/user/changeRoleUser');
var provider = require('../services/providers/provider');
var phone = require('../services/phones/phone');
var professions = require('../services/profession/professions');
var document = require('../services/documents/document');
var downloadFile = require('../services/documents/download');
var refurbishment = require('../services/refurbishments/refurbishment');
var workstate = require('../services/workstate/workstate');
var advertisement = require('../services/advertisements/advertisement');
var meeting = require('../services/meetings/meeting');

// ==================================
// Using routes
// ==================================
app.use('/login', login); // login users
app.use('/user', user); // get users and sign up
app.use('/password', password); // update password
app.use('/community', community); // get, post, update, delete a community
app.use('/communities', communities); // list of communities
app.use('/joinCommunity', joinCommunity); // user join a community
app.use('/pendingAccess', pendingAccess); // get the pending user requests to access a community
app.use('/requestAccessCommunity', requestAccessCommunity); // if user is admin, get the pending user request to access a community
app.use('/changeRole', changeRoleUser); // change the user role to president, secretary or owner
app.use('/phone', phone); // get a list of phones. Get, post, update, delete phones
app.use('/provider', provider); // get a list of providers. Get, post, update, delete a provider
app.use('/professions', professions); // get a list of professions
app.use('/documents', document); // get and post contracts
app.use('/download', downloadFile); // download a file
app.use('/refurbishment', refurbishment); // get and post refurbishment
app.use('/workstate', workstate); // get and post refurbishment
app.use('/advertisement', advertisement); // get and post advertisements
app.use('/meeting', meeting); // get and post meetings

module.exports = app;