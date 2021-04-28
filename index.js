require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const socket = require('socket.io')
const cors = require('cors')
const http = require('http')
const moment = require('moment')
moment.locale('id');
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
io.on("connection", (socket) => {
  console.log("client terhubung dengan id " + socket.id);

  socket.on("initialUserLogin", (idUser) => {
    console.log(`user:${idUser}`);
    socket.join(`user:${idUser}`)
  })

  socket.on('sendMessage', (data, callback) => {
    // messageModels.insetMessage(data)
    const date = new Date()
    const timeNow = moment(date).format('LT')
    const dataMessage = { ...data, time: timeNow }
    io.to(`user:${data.receiverId}`).emit('receiverMessage', dataMessage)
    callback(dataMessage)
  })

  socket.on('leftRoom', ({ username, namaRoom }) => {
    const date = new Date()
    const timeNow = moment(date).format('LT')
    const dataMessage = {
      username: "admin",
      message: `${username} telah meniggal group`,
      time: timeNow
    }
    io.to(`room:${namaRoom}`).emit('receiverMessage', dataMessage)
  })


  socket.on("disconnect", reason => {
 
    console.log("client disconnect zzzzzzzzzzzzz " + reason);
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