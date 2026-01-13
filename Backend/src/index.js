import dotenv from "dotenv";
dotenv.config();
import app from './app.js'
import connectDB from './db/db.js'


const PORT = process.env.PORT || 5000

connectDB()
.then(()=> {
    app.listen(PORT, () => {
      console.log(`app is running on ${PORT}`)
    })
})
.catch((error) => {
   console.log(error, "not connecting")
})