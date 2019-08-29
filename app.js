const express = require('express')
const app = express()
const run = require('./openBrowser.js')
app.listen(1024, async () => {
	console.log('editAce on port 1024!')
	run()
})
