const express = require('express');
const taskRoutes = require('./routes/tasks');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use('/api/tasks', taskRoutes);

app.listen(PORT, () => {
    console.log('Server is runing on port 3000');
});