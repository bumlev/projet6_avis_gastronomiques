// Importer le package http
const http = require('http');

// Importer app dans server.js
const app = require('./app');

/// Normaliser un port 
const normalizePort = val =>{
    const port = parseInt(val , 10);
    if (isNaN(port)) {
        return val;
    }
    if(port >=0){
        return port;
    }
    return false;
};

const port = normalizePort(process.env.PORT || '3000');

/// parametrer un port avec set.app
app.set('port' , port);

const errorHandler = error =>{
    if(error.syscall !== 'listen'){ 
        throw error;
    }
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges.');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use.');
            process.exit(1);
            break;
    
        default:
            throw error;
    }
};


// creer le serveur de node basique
const server = http.createServer(app);

server.on('error' , errorHandler);
server.on('listening' , () =>{
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe' + address : 'port ' + port;
    console.log('Listening on ' + bind);
});

/// execution su serveur sur un environnement avec le port 3000
server.listen(port);