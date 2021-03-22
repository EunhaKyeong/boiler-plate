const express = require('express')  //expres 모듈을 가져온다.
const app = express()   // 새로운 express app을 만든다.
const port = 5000   //port 설정
const bodyParser = require('body-parser');
const {User} = require('./models/User.js'); //User.js에서 modules.exports 객체들 중 User 객체만을 가져온다.
                                            //require('./models/User.js').User와 같은 의미

const {auth} = require('./middleware/auth.js');
const cookieParser = require('cookie-parser');
const config = require('./config/key.js');

//application/x-www-form-urlencoded와 같은 데이터만을 가지고 오도록 설정
app.use(bodyParser.urlencoded({
  extended: true
}));

//json 타입 데이터만 가져오도록 설정
app.use(bodyParser.json());
app.use(cookieParser());

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

app.post('api/users/register', (req, res) => {
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

app.post('api/users/login', (req, res)=> {
  //요청된 이메일을 DB에 있는지 찾는다.
  User.findOne({ email: req.body.email }, (err, userInfo)=> {
    if (!userInfo) {  //userInfo가 없다면 -> DB 검색 결과가 존재하지 않는다면
      return res.json({
        loginSuccess: false, 
        msg: "이메일이 존재하지 않습니다."
      })
    }

    //이메일이 DB에 존재하면 비밀번호가 일치하는지 확인한다.
    userInfo.comparePassword(req.body.password, (err, isMatch)=>{
      if (!isMatch) { //비밀번호가 틀렸으면
        return res.json({
          loginSuccess: false, 
          msg: "비밀번호가 틀렸습니다."
        })
      } else {  //비밀번호가 같으면 Token 생성
        userInfo.generateToken((err, userInfo)=> {
          res.cookie('x_auth', userInfo.token)  //token을 쿠키에 저장한다.
            .status(200)
            .json({
              loginSuccess: 'true', 
              userId: userInfo._id
            });
        })
      }
    })
  });  
})

app.get('/api/users/logout', auth, (req, res)=> {
  User.findOneAndUpdate({_id:req.user._id}, {token:""}, (err, user)=>{
    if (err) {
      return res.json({
        success:false, 
        err
      });
    } else {
      return res.status(200).json({
        success:true
      });
    }
  })
})

app.get('/api/users/auth', auth, (req, res)=>{ //middleware를 통해 auth를 성공적으로 마친 상태
  res.status(200).json({
    _id: req.user._id, 
    idAdmin: req.user.role===0? false:true, 
    isAuth: true, 
    email: req.user.email, 
    name: req.user.name, 
    lastname: req.user.lastname, 
    role: req.user.role
  });
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})