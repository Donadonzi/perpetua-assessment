const express = require('express')
require("dotenv").config();
const router = require('./routers/trackRouter')

const port = process.env.PORT || 3000;

const app = express();

app.use(router)

app.listen(port, () => {
	console.log('Server is up on port ' + port)
})