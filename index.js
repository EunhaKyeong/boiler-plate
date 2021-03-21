const express = require('express')  //expres 모듈을 가져온다.
const app = express()   // 새로운 express app을 만든다.
const port = 5000   //port 설정
const bodyParser = require('body-parser');
const {User} = require('./models/User.js'); //User.js에서 modules.exports 객체들 중 User 객체만을 가져온다.
                                            //require('./models/User.js').User와 같은 의미
const config = require('./config/key.js');

//application/x-www-form-urlencoded와 같은 데이터만을 가지고 오도록 설정
app.use(bodyParser.urlencoded({
  extended: true
}));
//json 타입 데이터만 가져오도록 설정
app.use(bodyParser.json());

const mongooes = require('mongoose');
mongooes.connect(config.mongoURI, {
  useNewUrlParser: true, 
  useUnifiedTopology: true, 
  useCreateIndex: true, 
  useFindAndModify: false
}).then(() => console.log('MongoDB Connected!'))
  .catch(err => console.log(err));

app.get('/', (req, res) => {
  res.send('Hello World!~~안녕하세요! 새해 복 많이 받으세요!')
})

app.post('/register', (req, res) => {
  //회원가입할 때 필요한 정보들을 client에서 가져오면 그것들을 데이터베이스에 저장한다.
  const user = new User(req.body);  //여기서 user는 User.js의 const User = mongoose.model('User', userSchema);에서의 User
  user.save((err)=> { //user.save() : user 객체를 DB에 저장한다.
    if(err)
      return res.json({
        success: false, 
        err //err 자체가 딕셔너리 형태 객체
      })
    else 
      return res.json({
        success: true
      })
  })
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})