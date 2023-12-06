

getCart_item()//시작과동시에 출력

document.addEventListener('DOMContentLoaded', function () {  //모든 페이지가 로드되고 나서.

    // 버튼에 이벤트 리스너 등록. 
    var buttons = document.querySelectorAll('.my-button'); //이걸 아이디로 가진 모든 버튼

    buttons.forEach(function (button) {
        button.addEventListener('click', async function () {
            // 버튼을 통해 class_data.id 가져옴
            var infoString = button.getAttribute('data-info');
            var infoObject = JSON.parse(infoString);

            //가져온 클래스 아이디가 장바구니에 담겨있는지 확인!
            const res = await axios.get('/cartItems/put');
            const c_item = res.data;

            //
            let cond = false;

            for (const cart_item of c_item) {
                cond = (cart_item.cls_cord===infoObject.cord && cart_item.cls_semester===infoObject.semester);
                if(cond){
                    alert("해당 과목이 이미 담겨있습니다.");
                    break;
                }
            }

            //1차 통과. 2차로 한도제한 걸렸는지 확인후 담기
            if(cond===false){
                if(c_item.length>14){
                    alert("장바구니 한도 초과!");
                    cond = true;
                }else{
                    // 서버에 값 전달
                    try {
                        await axios.post(`/cartItems`, { cord: infoObject.cord, semester: infoObject.semester });
                        // 장바구니 다시 로딩
                        getCart_item();
                        alert("담기 완료");
                        
                    } catch (err) {
                        console.error(err);
                    }
                }

            }
        });
    });
});


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
            button.textContent = '담기';
            button.addEventListener('click', async function () {
                try {
                    const response = await axios.post(`/registration`, { cord: cart_item.classData_id.cls_cord, semester: cart_item.classData_id.cls_semester, time:cart_item.classData_id.pg_time});
                    alert(response.data);

                } catch (err) {
                    console.error(err);
                }

            });

            const button2 = document.createElement('button');
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