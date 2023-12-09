const express = require('express')
const ejs = require('ejs')
const app = express()
const port = 3000
const mysql = require('mysql')


// MySQL 데이터베이스 연결 설정
const connection = mysql.createConnection({
  host: 'classcatch.cafe24app.com', // HeidiSQL 호스트
  user: 'classcatch', // HeidiSQL 유저네임
  password: 'classdb2!', // HeidiSQL 비밀번호
  database: 'classcatch' // 데이터베이스 이름
});

app.set('view engine', 'ejs')
app.set('views','./views') 



// 데이터베이스 연결
connection.connect((err) => {
  if (err) {
    console.error('데이터베이스 연결 실패: ', err);
    throw err;
  }
  console.log('데이터베이스 연결 성공!');
});

// 로그인 페이지 렌더링
app.get('/', (req, res) => {
  // 로그인 폼을 보여주는 HTML 페이지 렌더링
  res.render('login');
});

app.post('/login', function(request, response){
  var std_no = request.body.login_id;
  var std_pw = request.body.password;
  if (std_no && std_pw) {
    connection.mysql.query('SELECT * FROM student WHERE std_no = ? AND std_pw = ?', [std_no, std_pw], function(error, results, fields){
      if (error) throw error;
      if (results.length > 0) {
        request.session.loggedin = true;
        request.session.std_no = std_no;
        response.redirect('/');
        response.end();
      } 
    });
  }});


app.get('/guidepopup.ejs', (req, res) => {
  // 가이드 폼을 보여주는 HTML 페이지 렌더링
  res.render('guidepopup');
});

// 서버 실행
app.listen(port, () => {
  console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
});
