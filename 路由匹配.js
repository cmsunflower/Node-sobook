
var express = require('express');
var sqlQuery = require('./sqlQuery');
var app =express();

app.get('/',async (req,res)=>{
  //查询数据库20条数据
  let sql = 'select * from book limit 0,20';
  let ans =await sqlQuery(sql);
  // 查询所有的数据
  res.json(ans);
  // res.send('<h1>这是首页</h1>');
});

app.get('/books/:id',async (req,res)=>{
  let sql = 'select * from book where id = '+req.params.id;
  let ans =await sqlQuery(sql);
  res.send(ans);
})

module.exports = app;
