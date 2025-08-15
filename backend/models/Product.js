import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Ürün adı gereklidir'],
    trim: true,
    maxlength: [100, 'Ürün adı 100 karakterden fazla olamaz']
  },
  description: {
    type: String,
    required: [true, 'Ürün açıklaması gereklidir'],
    trim: true,
    maxlength: [500, 'Açıklama 500 karakterden fazla olamaz']
  },
  price: {
    type: Number,
    required: [true, 'Fiyat gereklidir'],
    min: [0, 'Fiyat 0\'dan küçük olamaz']
  },
  category: {
    type: String,
    required: false,
    trim: true,
    maxlength: [30, 'Kategori 30 karakterden fazla olamaz'],
    default: 'food'
  },
  available: {
    type: Boolean,
    default: true
  },
  popular: {
    type: Boolean,
    default: false
  },
  image: {
    type: String,
    default: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&h=400&fit=crop'
  },
  // Admin tracking
  createdBy: {
    type: String,
    default: 'admin'
  },
  updatedBy: {
    type: String,
    default: 'admin'
  }
}, {
  timestamps: true
});

// Index'ler - performans için
productSchema.index({ category: 1 });
productSchema.index({ available: 1 });
productSchema.index({ popular: -1 });

export default mongoose.model('Product', productSchema);