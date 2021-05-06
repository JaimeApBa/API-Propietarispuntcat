const express = require('express');
var cors = require('cors');
const app = express();
require('dotenv').config();

app.use(cors());

const PORT = process.env.PORT || 3000;

// parse application/json
app.use(express.json());
// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));


// ==================================
// Add routes
// ==================================

const router = require('./routes/routes');
app.use('/api', router);

// ==================================
//Server listening
// ==================================
app.listen(PORT, () => {
    console.log('Server started on port 3000...');
});