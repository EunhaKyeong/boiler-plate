const mongoose = require('mongoose');
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
//모델은 스키마를 감싸고 있는 객체(?)
const User = mongoose.model('User', userSchema);    //mongoose.model('모델명', 스키마);
//User 모델을 다른 파일에서도 사용할 수 있도록 exports
module.exports = { User };