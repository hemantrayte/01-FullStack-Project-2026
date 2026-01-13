import express from 'express'

const app = express()

const PORT = 4000;

app.get("/", (req, res) => {
  console.log("HIII")
})

app.listen(PORT,()=> {
  console.log(`app is running on port, ${PORT}`)
})