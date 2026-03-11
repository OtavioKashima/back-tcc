import http from 'http';
import app from './index.js';

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Api iniciada na porta ${PORT}`);
});

export default app;