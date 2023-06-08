'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate');

mongoosePaginate.paginate.options = {
  limit: 3, // how many records on each page
};

const PetSchema = new Schema({
  name: {type: String, required: true},
  species: {type: String, required: true},
  birthday: {type: Date, required: true},
  picUrl: {type: String},
  picUrlSq: {type: String},
  avatar: {type: String, required: true},
  favoriteFood: {type: String, required: true},
  description: {type: String, minlength: 50, required: true},
  price: {type: Number, required: true},
},
{
  timestamps: true,
});

// eslint-disable-next-line max-len
// PetSchema.index({name: 'text', species: 'text', favoriteFood: 'text', description: 'text'}, {name: 'My text index', weights: {name: 10, species: 4, favoriteFood: 2, description: 1}});
// without weights
// eslint-disable-next-line max-len
PetSchema.index({name: 'text', species: 'text', favoriteFood: 'text', description: 'text'});
PetSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Pet', PetSchema);
