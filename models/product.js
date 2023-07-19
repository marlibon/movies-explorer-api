const validator = require("validator");
const mongoose = require("mongoose");

// Определение схемы для свойств товара
const propertySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30
  },
  cost: {
    type: Number,
    required: true
  },
  weight: {
    type: String,
    minlength: 2,
    maxlength: 30
  }
});

// Определение основной схемы для товара
const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 60
  },
  cost: {
    type: Number,
    default: NaN
  },
  description: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 100
  },
  weight: {
    type: String,
    minlength: 2,
    maxlength: 30
  },
  type: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'category'
  },
  img: {
    type: String,
    required: true,
    validate: {
      validator: function (value) {
        //Проверка наличия ссылки
        return /^(http|https):\/\/[^ "]+$/.test(value);
      },
      message: 'Некорректная ссылка на изображение'
    }
  },
  often: {
    type: Boolean,
    default: false
  },
  properties: {
    type: Map,
    of: propertySchema
  },
  supplements: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'category'
  }
}, { toJSON: { useProjection: true }, toObject: { useProjection: true } });

module.exports = mongoose.model("product", productSchema);
