/* eslint-disable */
const cors = require('cors');
const express = require('express');
const admin = require('firebase-admin');
const functions = require('firebase-functions');
const { GoogleSpreadsheet } = require('google-spreadsheet');

// Admin
admin.initializeApp(functions.config().firebase);
const db = admin.firestore();

// App
const app = express();
app.use(cors({ origin: true }));

// Api
const GOOGLE_API = 'AIzaSyC-sIIKAphckqlKbvVSkLFnfC9RICb6JtY'

app.get('/', (req, res) => {
  res.send({
    'status': {
      'code': 404,
      'description': 'Invalid shop code'
    },
    'data': null,
  })
})

app.get('/:name', async (req, res) => {
  const lineId = req.params.name
  var shopData = {}
  var statusCode = 404

  try {
    const shops = await readShopsFormFirestore(lineId)
    if (shops.length > 0) {
      var shop = shops[0]
      Object.entries(shop).forEach((element) => {
        shopData[element[0]] = element[1]
      })
      var sheetsData = await readFileGoogleSheet(shop.data)
      categories = []
      await sheetsData.forEach(async sheet => {
        if(sheet[0].toLowerCase() == 'payment'){
          shopData['payment'] = sheet[1]
        }else if(sheet[0].toLowerCase() == 'delivery fee'){
          shopData['delivery_fee'] = sheet[1]
        }else{
          categories.push({
            'name' : sheet[0].toLowerCase() ,
            'menus' : sheet[1]
          })
        }
      })
      shopData['categories'] = categories
      if (sheetsData) {
        statusCode = 200
      } else {
        statusCode = 401
      }
    }
  } catch (error) {
    statusCode = 404
  }

  var callback
  switch(statusCode) {
    case 200:
      callback = {
        'status': {
          'code': 200,
          'description': 'Success'
        },
        'data' : shopData
      }
      break
    case 401:
      callback = {
        'status': {
          'code': 401,
          'description': 'Google Sheet API error'
        },
        'data' : shopData
      }
      break
    default:
      callback = {
        'status': {
            'code': 404,
            'description': 'Invalid shop code'
        },
        'data': null,
      }
  }
  res.send(callback)
});

async function checkPayment() {
}

async function readShopsFormFirestore(lineId) {
  try {
    const shop = await db.collection('shops').where('line_id', '==', lineId).get()
    console.log(shop)
    var list = []
    if (!shop.empty) {
      shop.forEach((doc) => {
        list.push(doc.data())
      })
    }
    return list
  } catch (error) {
    return []
  }
}

async function getDataInSheet(sheet){
    var rows = await sheet.getRows()
    list = []
    header = sheet.headerValues
    rows.forEach(row => {
      tmp = {}
      header.forEach(element => {
        tmp[element] = row[element] ? row[element] : ''
      })
      list.push(tmp)
    })
    return list
}

async function getDataInPaymentSheet(sheet){
  var rows = await sheet.getRows()
  list = []
  header = sheet.headerValues
  rows.forEach(row => {
    tmp = {}
    hasData = true
    header.forEach(element => {
      tmp[element] = row[element] ? row[element] : ''
      if(!row[element] || row[element]=='เลือก'){
        hasData = false
      }
    })
    if(hasData) {
      list.push(tmp)
    }
  })
  return list
}

async function readFileGoogleSheet(sheetUrl) {
  try {
    var parts = sheetUrl.split('/')
    var sheetId = parts[parts.length - 2]
    const doc = new GoogleSpreadsheet(sheetId)
    doc.useApiKey(GOOGLE_API)
    var dataFromSheets = []
    await doc.loadInfo()
    const sheets = doc.sheetsByIndex
    const promises = sheets.map(async (sheet)=>{
      if(sheet.title.toLowerCase()=='payment'){
        dataFromSheets.push([sheet.title,await getDataInPaymentSheet(sheet)])
      } else {
        dataFromSheets.push([sheet.title,await getDataInSheet(sheet)])
      }
    })
    await Promise.all(promises)
    return  dataFromSheets
  } catch (error) {
    return null
  }
}

// Expose Express API as a single Cloud Function:
// exports.widgets = functions.https.onRequest(app);
exports.menu = functions.region('asia-east2').https.onRequest(app);
