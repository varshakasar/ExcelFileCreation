const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');
const router = express.Router();
const async = require('async');
const csvWriter = require('csv-write-stream')
let app = express();
let retailerSchema = require('../models/retailerBrandSchema.js');
let Retailer = mongoose.model('retailerbrandscrapings', retailerSchema);
var xlsFilePath ='./brands.xlsx';

router.get('/xlsFile', (req, res, next) => {
  Retailer.find({}).limit(100).exec((err,retailerData) => {
    if(err){
      next(err);
    }else{
      let retailerWriter = csvWriter({
        separator: ' ',
          newline: '\n',
          headers: ["Id", "Month", "Period", "FeaturedOnHomepage", "FeaturedInMenu", "Brand_hero_image", "Brand_description", "Brand_logo", "Brand_screenshot", "Brand_name","BrandLink"]
      })
      retailerWriter.pipe(fs.createWriteStream(xlsFilePath));

      async.eachSeries(retailerData,(obj,d) => {
        let dataToWrite = [obj._id, obj.month, obj.period, obj.featuredOnHomepage, obj.featuredInMenu, obj.brand_hero_image, obj.brand_description, obj.brand_logo, obj.brand_screenshot, obj.brand_name, obj.brandLink];
        retailerWriter.write(dataToWrite);
      })
      res.send({
        success:true,
        message:'xls file created'
      })
    }
  })
});

module.exports = router;