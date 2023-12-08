const express = require('express');
const ejs = require('ejs');
const path = require('path');
const app = express();
const port = 3000;
const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'classcatch.cafe24app.com',
    user: 'classcatch',
    password: 'classdb2!',
    database: 'classcatch'
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

connection.connect((err) => {
    if (err) {
        console.error('데이터베이스 연결 실패: ', err);
        throw err;
    }
    console.log('데이터베이스 연결 성공!');
});

app.get('/', (req, res) => {
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
                    res.status(500).send('Internal Server Error');
                    return;
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
});


app.use('/public', express.static(path.join(__dirname, 'public')));

app.listen(port, () => {
    console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
});
