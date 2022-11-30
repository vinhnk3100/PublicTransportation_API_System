
require('dotenv').config()
const express = require('express')
const app = express();
const PORT = process.env.PORT;


// Router Call
app.get('/', (req, res) => {
    res.send("API Work")
})

app.listen(PORT, () => {
    console.log("App listening on PORT: ", PORT)
})