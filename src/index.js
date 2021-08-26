const express = require('express')
require("dotenv").config();
const router = require('./routers/trackRouter')

const app = express();

// app.get('', (req, res) => {
// 	res.send('Hi')
// })

app.use(router)

app.listen(3000, () => {
	console.log('Server is up!')
})