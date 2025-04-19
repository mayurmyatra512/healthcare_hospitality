import express from 'express'
import EventEmitter from 'events'
import cookieParser from 'cookie-parser';
import { rateLimit } from 'express-rate-limit';
import helmet from 'helmet';
import cors from 'cors';

const port = 3000 
const app = new express();

const eventEmitter = new EventEmitter();
const whitelist = ['::1'];

const generalLmiter = rateLimit({
	windowMs: 30 * 1000, // 15 minutes
	limit: 5, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  skip: (req, res) => {
    console.log(req);
    console.log("this is the request ip = "+req.ip);
    return whitelist.includes(req.ip);
  },
	standardHeaders: 'draft-8', // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
  message: 'Too many requests, please try again later.',
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
	// store: ... , // Redis, Memcached, etc. See below.
});

const strictLmiter = rateLimit({
	windowMs: 30 * 1000, // 15 minutes
	limit: 3, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
	standardHeaders: 'draft-8', // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
  message: 'Too many requests, please try again later.',
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
	// store: ... , // Redis, Memcached, etc. See below.
});
 


app.use(express.json());
app.use(cookieParser());
// app.use(limiter);
app.use(express.static('./public'));
app.use(helmet.frameguard({ action: 'deny' })); // Prevent clickjacking
app.use('/sample-get-request',strictLmiter); // Apply rate limiting to this route
app.use('/', generalLmiter); // Apply rate limiting to this route


eventEmitter.on('greet', (name) => {
    console.log(`Hello ${name}`);
});

eventEmitter.emit('greet', 'John Doe');

app.get('/', (req, res)=>{
    // console.log(req.cookies); // { test: 'test cookie value' }
    // res.cookie('test', 'test cookie value');
    // res.cookie('test', 'test cookie value', { maxAge: 900000, httpOnly: true });
    res.send("Hello World!!!")

});

app.get('/sample-get-request/:somedata', (req, res)=>{
    const somedata = req.params.somedata;
    res.send(`Sample GET request received!!! ${somedata}`);
});

app.get('/sample-get-request', (req, res) => {
    const k1 = req.query.k1;
    const k2 = req.query.k2;
    const k3 = req.query.k3;
    console.log(`k1: ${k1}, k2: ${k2}, k3: ${k3}`);
    res.send(`hello world`);
});

app.listen(port, ()=>{
    console.log(`Server is working on ${port} !!!`);
});
