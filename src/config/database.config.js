const mongoose = require("mongoose");

const _MONGO_URI = process.env.MONGO_DB_URI.replace('<password>', process.env.MONGO_DB_PASSWORD);

const connectDB = async () => {
    try {
        await mongoose
            .connect(_MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
            .then(() => console.log("MONGO Database run success"))
            .catch(err => console.log("ERR: MONGO Database: ",err))
    } catch(e) {
        console.log(e)
        process.exit(1)
    }
}

connectDB();