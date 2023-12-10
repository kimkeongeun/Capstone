//시작과동시에 출력
student_info();

async function put_click(cls_cord, cls_semester) {
    // 가져온 클래스 아이디가 장바구니에 담겨있는지 확인!
    const res = await axios.get('/cartItems/put');
    const c_item = res.data;

    let cond = false;


    for (const cart_item of c_item) {

        cond = (cart_item.cls_cord == cls_cord && cart_item.cls_semester == cls_semester);
        console.log('비교했음');
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
                console.log('테스트');
                console.log(cls_cord);
                console.log(cls_semester);
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
            button.className = "my-button but";
            button.textContent = '담기';
            button.addEventListener('click', async function () {
                try {
                    const response = await axios.post(`/registration`, { cord: cart_item.classData_id.cls_cord, semester: cart_item.classData_id.cls_semester, time:cart_item.classData_id.pg_time, id:cart_item.item_id});
                    alert(response.data);
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
