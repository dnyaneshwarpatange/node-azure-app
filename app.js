const express = require('express');
const app = express();
const PORT  = process.env.PORT || 3000;


app.get('/',(req,res)=>{
    res.send('Hi there, welcome to my app');
})

app.get('/bye',(req,res)=>{
    res.send('Goodbye, see you later');
})

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
});