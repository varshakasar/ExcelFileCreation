const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');
const router = express.Router();
const async = require('async');
const csvWriter = require('csv-write-stream')
let app = express();
let retailerSchema = require('../models/retailerBrandSchema.js');
let Retailer = mongoose.model('retailerbrandscrapings', retailerSchema);

router.get('/csvFile', (req, res) => {

  async.waterfall([
    (callback) => {
      Retailer.find({}).limit(100).exec((err,retailerData) => {
        if (err) return callback(err);
        callback(null, retailerData);
      });
    }, (retailerData, callback) => {
      if (retailerData && retailerData.length > 0) {
        var xlsFilesPath ='./brands.xlsx'
        let retailerWriter = csvWriter({
          separator: ' ',
          newline: '\n',
          headers: ["Id", "Month", "Period", "FeaturedOnHomepage", "FeaturedInMenu", "Brand_hero_image", "Brand_description", "Brand_logo", "Brand_screenshot", "Brand_name","BrandLink"]
        })
        retailerWriter.pipe(fs.createWriteStream(xlsFilesPath));
        async.eachSeries(retailerData, (obj, esCB) => {

          let dataToWrite = [obj._id, obj.month, obj.period, obj.featuredOnHomepage, obj.featuredInMenu, obj.brand_hero_image, obj.brand_description, obj.brand_logo, obj.brand_screenshot, obj.brand_name, obj.brandLink];
            //console.log(dataToWrite)
            retailerWriter.write(dataToWrite);
            esCB(null);
        }, (err) => {
          retailerWriter.end();
          callback(null, xlsFilesPath)
        }); //eachSeries
      } else {
        let error = 'No any retailer data found..';
        callback(error);
      }
    }
  ], (err, result) => {
    //console.log(err)
   //console.log(result)
    if (err) {
      res.send(err);
    } else {
      res.send('done')
      //res.download(result);
    }
  });
});

module.exports = router;