require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

const tokenRoutes =
require('./routes/tokenRoutes');

app.use('/api', tokenRoutes);

mongoose.connect(
process.env.MONGO_URL
)
.then(() =>
console.log("MongoDB Connected"))
.catch(err =>
console.log(err));

app.get("/", (req,res)=>{

res.send("Digital Token API Running");

});

const PORT =
process.env.PORT || 3000;

app.listen(PORT, ()=>{

console.log(
`Server running on port ${PORT}`
);

});
