const cors = require('cors');
const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const http = require('http');


require('dotenv').config({path: path.resolve(__dirname, './config/index.env')});
const PORT = process.env.PORT || 2000;
console.log(process.env.MONGO_URL);

const connectDB = require('./config/db')
connectDB();
//routes
const authRoutes = require('./routes/auth.js');
const userRoutes = require('./routes/user.js');
const Transaction = require('./routes/Transaction.js')



app.use(
    cors({
        exposedHeaders: '*',
    }),
);

app.use(bodyParser.urlencoded({extended: false}));
app.use(
    bodyParser.json({
        limit: '500mb',
    }),
);
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/transaction', Transaction);




app.get('/', (req, res) => {
    res.status(200).json({
        message: 'success oke',
    });
});

//Page Not founded
app.use((req, res) => {
    res.status(404).json({
        msg: 'Page not founded',
    });
});
const server = http.createServer(app);

server.listen(PORT, () => {
    console.log('Server on running on PORT ' + PORT);
});
