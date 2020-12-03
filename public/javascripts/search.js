let searchbtn = document.getElementById('searchbtn');
let searchtxt = document.getElementById('searchtxt');
// 获取input输入框的value值
searchbtn.addEventListener('click',function(e){
    let inputstr=searchtxt.value;
    location.href = '/search/'+inputstr;
})