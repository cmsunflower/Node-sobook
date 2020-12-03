
var express = require('express');
var path = require('path');
var sqlQuery = require('./sqlQuery');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/',async (req,res)=>{
    let category =await getCategory();
    // 默认选中分类 cid=1,cateid=0;
    let pageInfo =await getPageInfo();
    let sql = 'select * from book limit 0,20';
    let book = await sqlQuery(sql);
    let options = {
        book,
        category,
        pageInfo
    }
    res.render('bookIndex.ejs',options);
})

app.get('/book/:id',async (req,res)=>{
    let category =await getCategory();
    let sql = 'select * from book where id =?';
    let id = req.params.id;
    let book =await sqlQuery(sql,[id]);
    let options ={
        book:book[0],
        category
    };
    res.render('bookInfo.ejs',options);
})
app.use(express.static(path.join(__dirname, 'public')));

async function getCategory(){
    let sql ="select * from category";
    let category = await sqlQuery(sql);
    return Array.from(category);
}
app.get('/search/:searchKey',async (req,res)=>{
    let category = await getCategory();
    let sql = "select * from book where bookname like ? limit 0,20";
    let arr = [`%${req.params.searchKey}%`];
    let book = await sqlQuery(sql,arr);
    let options = {
        book,
        category
    };
    res.render('search.ejs',options);
})

app.get('/category/:cateid/page/:cid',async (req,res)=>{
    let category = await getCategory();
    let {cid,cateid} = req.params;
    // 首页获取分页信息
    let pageInfo = await getPageInfo(cid,cateid);
    // 查询当前分类当前页中包含的所有数据
    let sql = "select * from book where category in (select category from category where id=?) limit ?,20";
    let arr = [cateid,(cid-1)*20];
    //返回信息
    let book = await sqlQuery(sql,arr);
    let options = {
        book,
        category,
        pageInfo
    }
    res.render('bookIndex.ejs',options);
})

async function getPageInfo(cid=1,cateid=1){
    cid = parseInt(cid);
    cateid = parseInt(cateid);
    // cid表示当前页
    let sql ="select count(*) as count from book where category in (select category from category where id=?)"
    // 当前页的总数量
    let cateNum = await sqlQuery(sql,[cateid]);
    // 分页 每页20条数据
    let pageNum = Math.ceil(cateNum[0].count/20);
    // 起始页
    let startPage = cid-4<1?1:cid-4;
    // 终止页
    let endPage = cid +4>pageNum?pageNum:cid+4;
    // 返回最终的分页信息
    return {pageNum,startPage,endPage,cid,cateid}
    
}

module.exports = app;
