import http from 'http';
import app from './index.js';

const server = http.createServer(app);
server.listen(3000, () => {
    console.log('Api iniciada na porta 3000');
});

export default app;