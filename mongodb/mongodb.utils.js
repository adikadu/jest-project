const mongoose = require('mongoose');
require('dotenv').config();
const url = process.env.DB_URL;

const connectDb = async () => {
    try{
        await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true});
        console.log('CONNECTED TO DB');
    } catch (err){
        console.log(err);
        throw new Error(err);
    }
}

const disConnectDb = async() => {
    try{
        await mongoose.disconnect();
    } catch(err){
        console.log(err);
        throw new Error('Problem Disconncting the Database');
    }
}

const dropCollection = async(collectionName) => {
    try{
        await mongoose.connection.collection(collectionName).drop();
    } catch(err){
        if(err.status===26) console.log('Collection not found', collectionName);
        else {
            console.log(err);
            throw new Error('Problem connecting to Database');
        }
    }
}

module.exports = {
    connectDb,
    disConnectDb,
    dropCollection
};