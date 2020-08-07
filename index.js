const express = require('express');
const apiRoutes = require('./routes/api-routes');
const app = express();
const port =  3000;
const mongoDb = require('./mongodb/mongodb.utils');

app.use(express.json());
app.use('/api', apiRoutes);

app.get('/', (req, res)=>{
    res.status(200).send('<h1>Server running correctly</h1>');
});

mongoDb.connectDb();
app.listen(port, ()=>{
    console.log('Server running on port', port);
});