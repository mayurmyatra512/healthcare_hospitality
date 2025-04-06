import express from 'express'
// import events

const port = 3000 
const app = new express();

app.listen(port, ()=>{
    console.log(`Server is working on ${port} !!!`);
});
