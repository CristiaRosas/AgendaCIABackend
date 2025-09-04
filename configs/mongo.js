import mongoose from "mongoose";

export const dbConnection = async () => {

    try {
        mongoose.connection.on('error', () => {
            console.log('MongoDB | Could not be connect to mongoDB');
        })

        mongoose.connection.on('connecting', () => {
            console.log('MongoDB | try connecting');
        })

        mongoose.connection.on('connected', () => {
            console.log('MongoDB | connected to mongodb');
        })

        mongoose.connection.once('open', () => {
            console.log('MongoDB | connected to database');
        })

        mongoose.connection.on('reconnected', () => {
            console.log('MongoDB | reconnected to mongoDB');
        })

        mongoose.connection.on('disconnected', () => {
            console.log('MongoDB | disconnected ');
        })

        await mongoose.connect(process.env.MONGO_URI, {
            maxPoolSize: 50,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
            connectTimeoutMS: 30000
        })

    } catch (error) {
        console.log('data base error', error);
    }
}