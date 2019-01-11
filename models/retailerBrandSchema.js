var mongoose = require('mongoose');

var retailerBrand = new mongoose.Schema({
	brand:Number,
  month: String,
  period: Date,
  retailer_scraping:Number,
  featuredOnHomepage:String,
  featuredInMenu:String,
  brand_logo:String,
  brand_description:String,
  brand_hero_image:String,
  brand_screenshot:String,
  brand_name:String,
  brandLink:String,
  retailer:Number
});

module.exports = retailerBrand;