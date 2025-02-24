import mongoose from 'mongoose'

//Type saftey in TypeScript
type ConnectionObject = {
    isConnected?: number,
}

const connection: ConnectionObject= {}
async function dbConnect(){
    //Check if we have a connection to the database or if it's currently connecting
    if(connection.isConnected){
        console.log("Already connected to the database");
        return
    }

    try {
        const db = await mongoose.connect(process.env.MONGO_URI || "",{});

        connection.isConnected = db.connections[0].readyState;
        console.log("Database connected successfully");
    } catch (error) {
        console.log('Database connection failed',error);

        //Graceful exit in case of a connection error
    }
}

export default dbConnect;