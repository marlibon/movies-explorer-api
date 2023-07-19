const mongoose = require("mongoose");

// Определение схемы для категории
const categorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
    unique: true,
  },
  image: {
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
},
  { toJSON: { useProjection: true }, toObject: { useProjection: true } }
);

// Модель категории
const category = mongoose.model('category', categorySchema);

module.exports = { category };
