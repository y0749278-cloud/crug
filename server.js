const http = require('http').createServer();
const io = require('socket.io')(http, { 
    cors: { origin: "*" } 
});

let rooms = {};

io.on('connection', (socket) => {
    // Когда кто-то создает лобби
    socket.on('createRoom', () => {
        const roomId = Math.random().toString(36).substring(2, 6).toUpperCase();
        rooms[roomId] = { players: [socket.id] };
        socket.join(roomId);
        socket.emit('roomCreated', roomId);
        console.log('Создана комната:', roomId);
    });

    // Когда второй игрок вводит код
    socket.on('joinRoom', (roomId) => {
        if (rooms[roomId]) {
            socket.join(roomId);
            io.to(roomId).emit('startGame'); 
            console.log('Игрок вошел в:', roomId);
        }
    });

    // Передача движений между игроками
    socket.on('move', (data) => {
        socket.to(data.roomId).emit('enemyMove', data);
    });
});

// Слушаем порт, который даст Render
const PORT = process.env.PORT || 3000;

http.listen(PORT, () => console.log('Сервер запущен на порту ' + PORT));
