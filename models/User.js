const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;  //salt의 글자수(비밀번호를 암호화시킬 때 salt를 사용한다.)
const jwt = require('jsonwebtoken');

//User 관련 스키마 작성
const userSchema = mongoose.Schema({
    name: {
        type: String, 
        maxlength: 50,
    }, 
    email: {
        type: String, 
        trim: true, //빈칸 없애주는 역할 허용 ex)hi Myname -> hiMyname
        unique: 1   //중복 허용 X
    }, 
    password: {
        type: String, 
        minlength: 5
    }, 
    latname: {
        type: String, 
        maxlength: 50
    }, 
    role: {
        type: Number, 
        default: 0
    }, 
    image: String, 
    token: {
        type: String
    }, 
    tokenExp: {
        type: Number
    }
});

//DB에 데이터를 저장하기 전에 실행할 내용
userSchema.pre('save', function(next) {
    var userInfo = this;
    if(userInfo.isModified('password')) {
        //비밀번호를 암호화시킨다. - bcrypt 활용
        bcrypt.genSalt(saltRounds, function(err, salt) {    //암호화 시 필요한 salt를 생성한다.
            if (err) {
                return next(err);   //next를 하면 save() 함수로 이동한다.
            }
            bcrypt.hash(userInfo.password, salt, function(err, hash) {  //salt를 이용하여 비밀번호를 암호화 시킨다.
                if (err) {
                    return next(err);
                }
                userInfo.password = hash;
                next();
            })
        })
    } else {
        next();
    }
});

userSchema.methods.comparePassword = function(reqPassword, cbFunc) {
    //plainPassword(사용자가 입력한 pwd)
    bcrypt.compare(reqPassword, this.password, function(err, isMatch) { //bcrypt.compare()에서 reqPassword를 알아서 암호화해준다.
        if (err) return cbFunc(err);
        cbFunc(null, isMatch);
    })
}

userSchema.methods.generateToken = function(cbFunc) {
    var user = this;

    //jsonwebtoken을 이용해서 token을 생성한다.
    var token = jwt.sign(user._id.toJSON(), 'secretToken');  //token = user._id + 'secretToken'

    //생성한 token을 스키마 token 칼럼에 저장한다.
    this.token = token;
    this.save(function(err, user) {
        if (err) {
            return cbFunc(err);
        } else {
            return cbFunc(null, user);
        }
    });
}

userSchema.statics.findByToken = function(token, cbFunc) {
    var user = this;
    
    //token을 복호화(디코딩)한다.
    jwt.verify(token, 'secretToken', function(err, decodedToken) {
        //유저 아이디(decodedToken:token을 디코딩 하면 userId)를 이용해 유저를 찾는다.
        user.findOne({"_id":decodedToken, "token":token}, function(err, user) {
            if (err) {
                return cbFunc(err);
            } else {
                return cbFunc(null, user);
            }
        })
    });
}

//모델은 스키마를 감싸고 있는 객체(?)
const User = mongoose.model('User', userSchema);    //mongoose.model('모델명', 스키마);
//User 모델을 다른 파일에서도 사용할 수 있도록 exports
module.exports = { User };