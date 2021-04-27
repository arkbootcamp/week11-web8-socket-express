const express = require('express')
const morgan = require('morgan')
const socket = require('socket.io')
const cors = require('cors')
const http = require('http')
const userRoute = require('./src/routes/user')
const PORT = process.env.PORT || 4567

const app = express()
const httpServer = http.createServer(app)
const io = socket(httpServer, {
  cors: {
    origin: '*',
  }
})

// socket io
io.on("connection", (socket)=>{
  console.log("client terhubung dengan id " + socket.id );
  
  let count = 0
  socket.on('kirimMessage', (data)=>{
    // messageModels.insetMessage(data)
    socket.broadcast.emit('recMessage', count +' '+ data)
    count ++
    console.log(data);
  })
  
  
  
  socket.on("disconnect", reason=>{
    console.log("client disconnect "+reason);
  })
  
})

// res api
app.use(morgan('dev'))
app.use(cors())
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.get('/', (req, res)=>{
  res.json({
    message: 'server running'
  })
})
app.use('/user', userRoute)

httpServer.listen(PORT, ()=>{
  console.log('server is running on port ' + PORT);
})