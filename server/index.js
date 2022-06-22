const express = require('express');
const app = express();

const port = 99
const path = require('path')

app.use(express.json());
app.use(express.static(path.join(__dirname, '../client/dist')));
app.use(express.urlencoded({extended:true}));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})