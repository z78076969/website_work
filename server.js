const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const Datastore = require('nedb');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// 建立 NeDB 資料庫
const menuDB = new Datastore({ filename: './menu.db', autoload: true });

// 初始化菜單資料（如果資料庫是空的）
menuDB.insert([
  { id: 1, name: "招牌炸蛋蔥油雞肉飯", price: "大份NT$70/小份NT$60", img: "images/大雞.jpg", category: "主食" },
  { id: 2, name: "炸蛋椒麻滷肉飯", price: "大份NT$60/小份NT$50", img: "images/大魯.jpg", category: "主食" },
  { id: 3, name: "皮蛋豆腐", price: "NT$35", img: "images/皮蛋豆腐.jpg", category: "小菜" },
]);




// 提供菜單資料的 API
app.get('/menu', (req, res) => {
  menuDB.find({}, (err, docs) => {
    if (err) {
      res.status(500).send({ error: '資料庫讀取錯誤' });
    } else {
      // 將資料按照分類分組
      const categorizedMenu = {
        mainDishes: docs.filter(item => item.category === "主食"),
        sideDishes: docs.filter(item => item.category === "小菜"),
        soupDishes: docs.filter(item => item.category === "湯品"),
        noEggDishes: docs.filter(item => item.category === "無蛋飯")
      };
      res.json(categorizedMenu);
    }
  });
});




// 啟動伺服器
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`伺服器已啟動，監聽埠號 ${PORT}`);
});