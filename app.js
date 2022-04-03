const express = require('express');
const ejs = require('ejs');
const axios = require('axios');
const res = require('express/lib/response');
const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', (req, res) => {

  const date = req.query;

  let isStartDate;
  let isEndtDate;
  // query check
  if (Object.keys(date).length !== 0) {
    isStartDate = (typeof(date.startDate) != 'undefined') ? (Object.keys(date.startDate).length !== 0) : false;
    isEndtDate = (typeof(date.endDate) != 'undefined') ? (Object.keys(date.endDate).length !== 0) : false;
  }

  if (isStartDate && isEndtDate) {
    getData(date).then((data) => {
      const resultArray = groupAndCalculate(data)
      res.render('index', {
        resultArray
      })
    }).catch((err) => {
      res.send(err.message)
    })
  } else {
    let resultArray = []
    res.render('index', {
      resultArray
    })
  }

});
app.get('*',(req, res) =>{
  res.send('<h1 style="text-align: center;">page not found 404</h1>');
})

const getData = async (date) => {

  const url = `https://seffaflik.epias.com.tr/transparency/service/market/intra-day-trade-history?endDate=${date.endDate}&startDate=${date.startDate}`;

  try {
    const response = await axios.get(url);
    return response.data.body.intraDayTradeHistoryList;
  } catch (error) {
    throw error
  }
}

const groupAndCalculate = (data) => {
  let results = [];
  let contIndex = 0;
  data.map((element) => {
    if (!((element.conract).includes('PB'))) {
      const found = results.find((result, index) => {
        if (result.contract == element.conract) {
          contractIndex = index;
          return true;
        }
      });
      if (found) {
        results[contIndex].topIsMik += element.quantity / 10;
        results[contIndex].topIsTut += (element.price * element.quantity) / 10;
        results[contIndex].agOrtFiy = results[contIndex].topIsTut / results[contIndex].topIsMik;
      } else {
        let contract = element.conract;
        let topIsMik = (element.quantity / 10);
        let topIsTut = ((element.price * element.quantity) / 10);
        let agOrtFiy = topIsTut / topIsMik;
        results.push({
          contract,
          topIsMik,
          topIsTut,
          agOrtFiy
        });
      }
    };

  });
  return results;
}

app.listen('5000', () => {
  console.log('server running on 5000 port');
})