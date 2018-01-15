#!/usr/bin/env node

var express = require('express');
var HID = require('node-hid');

var app = express();

// add cors
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

const VENDORID=66, PRODUCTID=16896;

const writeColor = (color) => {
  var device = new HID.HID(VENDORID,PRODUCTID);
  device.write(color);
  device.close();
}

app.get('/', (req, res) => {
  res.json({devices:HID.devices()})
})

app.get('/red', (req, res) => {
  try {
    writeColor([0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x02,]);
    res.json({color:'red'});
  } catch (error) {
    res.json({error:'No andon light connected'});
  }
})

app.get('/orange', (req, res) => {
  try {
    writeColor([0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01,]);
    res.json({color:'orange'});
  } catch (error) {
    res.json({error:'No andon light connected'});
  }
})

app.get('/green', (req, res) => {
  try {
    writeColor([0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,]);
    res.json({color:'green'});
  } catch (error) {
    res.json({error:'No andon light connected'});
  }
})

var server = app.listen(48017, () => {
  console.log('Andon-light-server started')
})
