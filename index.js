const express = require('express')  //expres 모듈을 가져온다.
const app = express()   // 새로운 express app을 만든다.
const port = 5000   //port 설정

const mongooes = require('mongoose');
mongooes.connect('mongodb+srv://eunha:g<password>@boilerplate.2gutz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {
  useNewUrlParser: true, 
  useUnifiedTopology: true, 
  useCreateIndex: true, 
  useFindAndModify: false
}).then(() => console.log('MongoDB Connected!'))
  .catch(err => console.log(err));

app.get('/', (req, res) => {
  res.send('Hello World!~~안녕하세요!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})