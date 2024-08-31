const express = require('express');

const app = require('./app');
const port = process.env.PORT || 7008;
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});