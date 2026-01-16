const http = require('http').createServer();
const io = require('socket.io')(http, {
    cors: { origin: "*", methods: ["GET", "POST"] } 
});

let rooms = {};

io.on('connection', (socket) => {
    socket.on('createRoom', () => {
        const roomId = Math.random().toString(36).substring(2, 6).toUpperCase();
        rooms[roomId] = { players: [socket.id] };
        socket.join(roomId);
        socket.emit('roomCreated', roomId);
    });

    socket.on('joinRoom', (roomId) => {
        if (rooms[roomId]) {
            socket.join(roomId);
            io.to(roomId).emit('startGame');
        }
    });

    socket.on('move', (data) => {
        socket.to(data.roomId).emit('enemyMove', data);
    });

    socket.on('hit', (data) => {
        socket.to(data.roomId).emit('takeDamage');
    });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => console.log('Server online on port ' + PORT));
