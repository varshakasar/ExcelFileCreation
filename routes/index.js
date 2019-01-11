const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');
const async = require('async');
let app = express();
const excel = require('exceljs');
const router = express.Router();
let retailerSchema = require('../models/retailerBrandSchema.js');

let Retailer = mongoose.model('retailerbrandscrapings', retailerSchema);

let workbook1 = new excel.Workbook();

let sheet1 = workbook1.addWorksheet('TestData');
let xlsfilepath = './file.xlsx';

let reColumns = [
{header:'_id',key:'_id',witdh:10},
{header:'brand',key:'brand',witdh:10},
{header:'month',key:'month',witdh:10},
{header:'period',key:'period',witdh:10},
{header:'retailer_scraping',key:'retailer_scraping',witdh:10},
{header:'featuredOnHomepage',key:'featuredOnHomepage',witdh:10},
{header:'featuredInMenu',key:'featuredInMenu',witdh:10},
{header:'brand_logo',key:'brand_logo',witdh:10},
{header:'brand_description',key:'brand_description',witdh:20},
{header:'brand_hero_image',key:'brand_hero_image',witdh:10},
{header:'brand_screenshot',key:'brand_screenshot',witdh:10},
{header:'brand_name',key:'brand_name',witdh:10},
{header:'brandLink',key:'brandLink',witdh:10},
{header:'retailer',key:'retailer',witdh:10}
];

sheet1.columns = reColumns;
router.get('/file',(req,res,next) => {

  Retailer.find({}).limit(100).exec((err,result) => {
  	if(err){
  		next(err);
  	}else{
  		async.eachSeries(result,(obj,callback) => {

  			let rowData = {};
  			rowData['_id'] = obj._id;
  			rowData['brand'] = obj.brand;
  			rowData['month'] = obj.month;
  			rowData['period'] = obj.period;
  			rowData['retailer_scraping'] = obj.retailer_scraping;
  			rowData['featuredOnHomepage'] = obj.featuredOnHomepage;
  			rowData['featuredInMenu'] = obj.featuredInMenu;
  			rowData['brand_logo'] = obj.brand_logo;
  			rowData['brand_description'] = obj.brand_description;
  			rowData['brand_hero_image'] = obj.brand_hero_image;
  			rowData['brand_screenshot'] = obj.brand_screenshot;
  			rowData['brand_name'] = obj.brand_name;
  			rowData['brandLink'] = obj.brandLink;

  			sheet1.addRow(rowData);
  			callback();
  			},function(){
  			workbook1.xlsx.writeFile(xlsfilepath).then(function() {
  					res.send({
  						success:true,
  						message:'excel file created'
  					})
  			});
  		})

  	}
  })
})

module.exports = router;