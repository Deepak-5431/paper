
import express from 'express';
import cors from 'cors';
import Connection from './database/db.js';
import router from './routing/router.js';




const app = express();

const Port = 5000;

app.use(cors());
app.use(express.json());
app.use('/api',router);

//Connection();

app.listen(Port,()=>console.log(`connection will be here ${Port}`))