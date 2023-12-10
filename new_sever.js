const express = require('express');
const ejs = require('ejs');
const path = require('path');
const app = express();
const mysql = require('mysql');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const morgan = require('morgan');
const { sequelize } = require('./models');

const c_itemRouter = require('./routes/cartItems');
const regisRouter = require('./routes/registration');
const stdRouter = require('./routes/student');



dotenv.config();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));



sequelize.sync({force:false})
    .then(()=>{
        console.log('데이터베이스 연결성공');
    })
    .catch((err)=>{
        console.error(err);
    });

const connection = mysql.createConnection({
    host: 'classcatch.cafe24app.com',
    user: 'classcatch',
    password: 'classdb2!',
    database: 'classcatch',
});


connection.connect((err) => {
    if (err) {
        console.error('데이터베이스 연결 실패: ', err);
        throw err;
    }
    console.log('데이터베이스 연결 성공!');
});

app.use(morgan('dev'));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
        httpOnly: true,
        secure: false,
    },
    name: 'session-cookie',
}));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


app.use('/cartItems', c_itemRouter);
app.use('/registration', regisRouter);
app.use('/student', stdRouter);

app.get('/', (req, res) => {
    res.render('login');
});

app.use('/public', express.static(path.join(__dirname, 'public')));

app.post('/login', (req, res) => {
    console.log('로그인 바디')
    console.log(req.body)
    var std_no = req.body.login_id;
    var std_pw = req.body.password;

    if (std_no && std_pw) {
        connection.query('SELECT * FROM student WHERE std_no = ? AND std_pw = ?', [std_no, std_pw], (error, results) => {
            if (error) {
                console.error('MySQL query error:', error);
                console.log('서버 오류')
                res.status(401).redirect('/');
                return;
            }

            if (results.length > 0) {
                req.session.loggedin = true;
                req.session.std_no = std_no;
                req.session.std_pw = std_pw;
                console.log('로그인 성공')
                res.redirect('/index');
            } else {
                console.log('로그인 실패')
                res.status(401).redirect('/');
            }
        });
    } else {
        res.status(400);
    }
});

app.get('/index', (req, res) => {
    if (req.session.std_no == 'undefined' || !req.session.std_no) {
        console.log('미 로그인 이용자')
        res.redirect('/');
    }else{   

    console.log('서버로 들어온 요청:', req.query);
    const selectedCompletionType = req.query.completionType;
    const selectedClassification = req.query.classification;

    // 중복을 제거한 이수구분을 조회하는 쿼리
    const completionTypeQuery = 'SELECT DISTINCT cls_type FROM class';

    // 중복을 제거한 detailed_area를 조회하는 쿼리
    const detailedAreaQuery = 'SELECT DISTINCT detailed_area FROM class';

    // 각각의 데이터 조회
    connection.query(completionTypeQuery, (completionTypeError, completionTypes) => {
        if (completionTypeError) {
            console.error('데이터베이스 쿼리 오류:', completionTypeError);
            res.status(500).send('Internal Server Error');
            return;
        }

        connection.query(detailedAreaQuery, (detailedAreaError, detailedAreas) => {
            if (detailedAreaError) {
                console.error('데이터베이스 쿼리 오류:', detailedAreaError);
                res.status(500).send('Internal Server Error');
                return;
            }

            // 중복 제거된 detailed_area 값들을 가져왔습니다.
            console.log('중복 제거된 detailed_areas:', detailedAreas);

            // 전체 수업 데이터 조회
            const query = 'SELECT * FROM class';
            connection.query(query, (error, classifications) => {
                if (error) {
                    console.error('데이터베이스 쿼리 오류:', error);
                    return res.status(500).json({ error: 'Internal Server Error' });
                }

                if (selectedCompletionType && selectedClassification) {
                    const searchQuery = 'SELECT * FROM class WHERE cls_type = ? AND detailed_area = ?';

                    connection.query(searchQuery, [selectedCompletionType, selectedClassification], (searchError, searchResults) => {
                        if (searchError) {
                            console.error('데이터베이스 쿼리 오류:', searchError);
                            res.status(500).send('Internal Server Error');
                            return;
                        }

                        // 수정된 부분: 검색 결과를 JSON으로 응답
                        res.json(searchResults || []); // 검색 결과가 null이면 빈 배열로 초기화
                    });
                } else {
                    // 초기 화면 렌더링
                    res.render('index', {
                        completionTypes,
                        detailedAreas, // 중복되지 않은 detailed_area 전달
                        classifications,
                        searchResults: [], // 검색 결과 초기화
                    });
                }
            });
        });
    });
    }
});

app.get('/index2', (req, res) => {
    if (req.session.std_no == 'undefined' || !req.session.std_no) {
        console.log('미 로그인 이용자')
        res.redirect('/');
    }
    res.render('index copy');
});

app.get('/index3', (req, res) => {
    if (req.session.std_no == 'undefined' || !req.session.std_no) {
        console.log('미 로그인 이용자')
        res.redirect('/');
    }
    res.render('index copy 2');
});



app.get('/guidepopup.ejs', (req, res) => {
    res.render('guidepopup');
});

app.listen(port, () => {
    console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
});
