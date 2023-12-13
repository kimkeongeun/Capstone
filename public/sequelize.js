//시작과동시에 출력
student_info();

async function put_click(cls_cord, cls_semester) {
    // 가져온 클래스 아이디가 장바구니에 담겨있는지 확인!
    const res = await axios.get('/cartItems/put');
    const c_item = res.data;

    let cond = false;


    for (const cart_item of c_item) {

        cond = (cart_item.cls_cord == cls_cord && cart_item.cls_semester == cls_semester);
        console.log(cond);
        if (cond) {
            alert("해당 과목이 이미 담겨있습니다.");
            break;
        }
    }

    // 1차 통과. 2차로 한도제한 걸렸는지 확인후 담기
    if (cond === false) {
        if (c_item.length > 14) {
            alert("장바구니 한도 초과!");
            cond = true;
        } else {
            // 서버에 값 전달
            try {
                await axios.post(`/cartItems`, { cord: cls_cord, semester: cls_semester }, { headers: { 'Content-Type': 'application/json' } });
                // 장바구니 다시 로딩
                getCart_item();
                alert("담기 완료");
            } catch (err) {
                console.error(err);
            }
        }
    }
}

async function getCart_item() {
    try {
        const res = await axios.get('/cartItems');
        const c_item = res.data;
        const tbody = document.querySelector('#cart-list tbody');
        tbody.innerHTML = '';

        c_item.map(function (cart_item, index) {

            const row = document.createElement('tr');

            let td = document.createElement('td');
            td.textContent = index + 1;
            row.appendChild(td);

            const button = document.createElement('button');
            button.className = "my-button but allbt";
            button.textContent = '담기';
            button.addEventListener('click', async function () {
                try {
                    const response = await axios.post(`/registration`, { cord: cart_item.classData_id.cls_cord, semester: cart_item.classData_id.cls_semester, time:cart_item.classData_id.pg_time, id:cart_item.item_id});
                    alert(cart_item.classData_id.cls_name + ' >> ' + response.data);
                    getCart_item()

                } catch (err) {
                    console.error(err);
                }

            });

            const button2 = document.createElement('button');
            button2.className = "my-button but";
            button2.textContent = '삭제';
            button2.addEventListener('click', async function () {
                try {
                    const response =await axios.delete(`/cartitems/${cart_item.item_id}`);
                    getCart_item();
                    alert(response.data);
                    
                } catch (err) {
                    console.error(err);
                }

            });


            td = document.createElement('td');
            td.appendChild(button);
            row.appendChild(td);

            td = document.createElement('td');
            td.appendChild(button2);
            row.appendChild(td);

            td = document.createElement('td');
            td.textContent = cart_item.classData_id.cls_type;
            row.appendChild(td);

            td = document.createElement('td');
            td.textContent = cart_item.classData_id.cls_cord;
            row.appendChild(td);

            td = document.createElement('td');
            td.textContent = cart_item.classData_id.credit;
            row.appendChild(td);

            td = document.createElement('td');
            td.textContent = cart_item.classData_id.cls_name;
            row.appendChild(td);

            td = document.createElement('td');
            td.textContent = cart_item.classData_id.instrunctor;
            row.appendChild(td);

            td = document.createElement('td');
            td.textContent = cart_item.classData_id.pg_time + ' ' + cart_item.classData_id.room;
            row.appendChild(td);

            td = document.createElement('td');
            td.textContent = "전체학년";
            row.appendChild(td);

            td = document.createElement('td');
            td.textContent = "재수강구분";
            row.appendChild(td);


            td = document.createElement('td');
            td.textContent = "취득년도";
            row.appendChild(td);


            td = document.createElement('td');
            td.textContent = "취득 과목명";
            row.appendChild(td);

            tbody.appendChild(row);
        });
    } catch (err) {
        console.error(err);
    }
}



async function student_info() {
    try {
        const res = await axios.get('/student');
        const std_data = res.data;

        const container = document.querySelector('#stu_info');
        container.innerHTML = '';  // Clear existing content

        std_data.forEach(function (student) {
            const row = document.createElement('div'); // Change to a container element, e.g., 'div'

            let p = document.createElement('p');
            p.textContent = '2023년도 2학기';
            row.appendChild(p);

            p = document.createElement('p');
            p.textContent = student.department;
            row.appendChild(p);

            p = document.createElement('p');
            p.textContent = student.std_grade;
            row.appendChild(p);

            p = document.createElement('p');
            p.textContent = student.std_nm  + ' ' + student.std_no
            row.appendChild(p);

            p = document.createElement('p');
            p.textContent = '12 ~ ' + student.max_credit + '학점'
            row.appendChild(p);

            p = document.createElement('p');
            p.textContent = '주'
            row.appendChild(p);

            p = document.createElement('p');
            p.textContent = '복'
            row.appendChild(p);

            p = document.createElement('p');
            p.textContent = '다'
            row.appendChild(p);

            p = document.createElement('p');
            p.textContent = '부'
            row.appendChild(p);

            container.appendChild(row);
        });
    } catch (err) {
        console.error(err);
    }
}



async function getReg_list() {
    try {
        const res = await axios.get('/registration');
        const g_list = res.data;
        const tbody = document.querySelector('#reg-list tbody');
        tbody.innerHTML = '';

        g_list.map(function (registration, index) {

            const row = document.createElement('tr');

            let td = document.createElement('td');
            td.textContent = index + 1;
            row.appendChild(td);

            const button2 = document.createElement('button');
            button2.className = "my-button but";
            button2.textContent = '삭제';
            button2.addEventListener('click', async function () {
                try {
                    const response =await axios.delete(`/registration/${registration.reg_id}`);
                    getReg_list();
                    alert(response.data);
                    
                } catch (err) {
                    console.error(err);
                }

            });

            td = document.createElement('td');
            td.appendChild(button2);
            row.appendChild(td);

            td = document.createElement('td');
            td.textContent = registration.clsData_id.cls_type
            row.appendChild(td);

            td = document.createElement('td');
            td.textContent = registration.clsData_id.cls_cord
            row.appendChild(td);

            td = document.createElement('td');
            td.textContent = registration.clsData_id.credit
            row.appendChild(td);

            td = document.createElement('td');
            td.textContent = ' '
            row.appendChild(td);

            td = document.createElement('td');
            td.textContent = registration.clsData_id.cls_name
            row.appendChild(td);

            td = document.createElement('td');
            td.textContent = registration.clsData_id.instrunctor;
            row.appendChild(td);

            td = document.createElement('td');
            td.textContent = registration.clsData_id.pg_time + ' ' + registration.clsData_id.room;
            row.appendChild(td);

            tbody.appendChild(row);
        });
    } catch (err) {
        console.error(err);
    }
};



let idArray = new Array();
let dayArray = new Array();
let timeArray = new Array();

async function getReg_tm() {
    try {
        const res = await axios.get('/registration');
        const g_list = res.data;

        let n=0;


        for (let i = 0; i < g_list.length; i++) {
            let id = g_list[i].reg_id;
            let g_time = g_list[i].clsData_id.pg_time;
            let time = '';
        
            // pg_time이 null 또는 undefined인 경우 처리
            if (!g_time) {
                console.log('값 없음')
                continue; // 다음 반복으로 건너뜀
            }
            
            //문자열에서 사이버 부분 제거
            if(g_time.startsWith('사')){
                g_time = g_time.substring(2)
            }

            //요일 분리
            let Day = g_time.substring(0, 1);
            g_time = g_time.substring(1)

            while(true){
                
                if(g_time==''){
                    break;
                }
                time = g_time.substring(0, 1);
                g_time = g_time.substring(2)

                //시간표 담을거임
                idArray[n]=id;
                dayArray[n]=Day
                timeArray[n]=time
                n++;
            }
        }
    } catch (err) {
        console.error(err);
    }
};

async function tm_s(day, time){
    
    for(let i =0; i<idArray.length; i++){
        
        if(dayArray[i]==day && timeArray[i]==time){
            return idArray[i]
        }
    }
    return ' '
};

async function getReg_tmP() {
    try {
        const res = await axios.get('/registration');
        const g_list = res.data;
        await getReg_tm();
        const tbody = document.querySelector('#location tbody');
        tbody.innerHTML = '';
        let id;

        for (let i = 0; i < 9; i++){

            const row = document.createElement('tr');

            let td = document.createElement('td');
            td.textContent = i + 1 + '교시';
            row.appendChild(td);

            id = await tm_s('월', i+1);
            const res1 = await axios.get(`/registration/${id}`);
            const cls1 = res1.data;
            td = document.createElement('td');
            if(id != ' '){
                td.innerHTML += `${cls1[0].clsData_id.cls_name}<br>`;
                td.innerHTML += `${cls1[0].clsData_id.pg_time}<br>`;
                td.innerHTML += `${cls1[0].clsData_id.room}<br>`;
                td.innerHTML += `${cls1[0].clsData_id.instrunctor}<br>`;
            }else{
                td.textContent = ''
            }
            row.appendChild(td);


            id = await tm_s('화', i+1);
            const res2 = await axios.get(`/registration/${id}`);
            const cls2 = res2.data;
            td = document.createElement('td');
            if(id != ' '){
                td.innerHTML += `${cls2[0].clsData_id.cls_name}<br>`;
                td.innerHTML += `${cls2[0].clsData_id.pg_time}<br>`;
                td.innerHTML += `${cls2[0].clsData_id.room}<br>`;
                td.innerHTML += `${cls2[0].clsData_id.instrunctor}<br>`;
            }else{
                td.textContent = ''
            }
            row.appendChild(td);

            id = await tm_s('수', i+1);
            const res3 = await axios.get(`/registration/${id}`);
            const cls3 = res3.data;
            td = document.createElement('td');
            if(id != ' '){
                td.innerHTML += `${cls3[0].clsData_id.cls_name}<br>`;
                td.innerHTML += `${cls3[0].clsData_id.pg_time}<br>`;
                td.innerHTML += `${cls3[0].clsData_id.room}<br>`;
                td.innerHTML += `${cls3[0].clsData_id.instrunctor}<br>`;
            }else{
                td.textContent = ''
            }
            row.appendChild(td);

            id = await tm_s('목', i+1);
            const res4 = await axios.get(`/registration/${id}`);
            const cls4 = res4.data;
            td = document.createElement('td');
            if(id != ' '){
                td.innerHTML += `${cls4[0].clsData_id.cls_name}<br>`;
                td.innerHTML += `${cls4[0].clsData_id.pg_time}<br>`;
                td.innerHTML += `${cls4[0].clsData_id.room}<br>`;
                td.innerHTML += `${cls4[0].clsData_id.instrunctor}<br>`;
            }else{
                td.textContent = ''
            }
            row.appendChild(td);

            id = await tm_s('금', i+1);
            const res5 = await axios.get(`/registration/${id}`);
            const cls5 = res5.data;
            td = document.createElement('td');
            if(id != ' '){
                td.innerHTML += `${cls5[0].clsData_id.cls_name}<br>`;
                td.innerHTML += `${cls5[0].clsData_id.pg_time}<br>`;
                td.innerHTML += `${cls5[0].clsData_id.room}<br>`;
                td.innerHTML += `${cls5[0].clsData_id.instrunctor}<br>`;
            }else{
                td.textContent = ''
            }
            row.appendChild(td);


            tbody.appendChild(row);
        };
    } catch (err) {
        console.error(err);
    }

};


async function allButtonClick() {
    // "일괄 클릭" 버튼을 클릭했을 때 실행할 코드
    console.log('일괄 클릭 버튼을 클릭했습니다.');

    const tbody = document.querySelector('tbody');

    // 다른 버튼 자동 클릭
    const otherButtons = document.querySelectorAll('.allbt');

    if (otherButtons.length > 0) {
        otherButtons.forEach(async function (button) {
            button.click(); // 각 버튼을 클릭하는 동작
        });
    } else {
        console.error('버튼을 찾을 수 없습니다.');
    }
};