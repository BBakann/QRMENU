import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
    id: {
        type: String,
        required: [true, 'Kategori ID gereklidir'],
        unique: true,
        trim: true,
        lowercase: true,
        maxlength: [30, 'Kategori ID 30 karakterden fazla olamaz']
    },
    name: {
        type: String,
        required: [true, 'Kategori adı gereklidir'],
        maxlength: [50, 'Kategori adı 50 karakterden fazla olamaz'],
        trim: true
    },
    description: {
        type: String,
        maxlength: [200, 'Açıklama 200 karakterden fazla olamaz'],
        trim: true,
        default: ''
    },
    active: {
        type: Boolean,
        default: true
    },
    sortOrder: {
        type: Number,
        default: 0
    },
    createdBy: {
        type: String,
        required: [true, 'Oluşturan kullanıcı gereklidir']
    },
    updatedBy: {
        type: String,
        required: [true, 'Güncelleyen kullanıcı gereklidir']
    }
}, {
    timestamps: true // createdAt ve updatedAt otomatik ekler
});

// Index'ler - performans için
categorySchema.index({ active: 1, sortOrder: 1 });
categorySchema.index({ id: 1 }, { unique: true });

// Virtual field - bu kategorideki ürün sayısı
categorySchema.virtual('productCount', {
    ref: 'Product',
    localField: 'id',
    foreignField: 'category',
    count: true
});

export default mongoose.model('Category', categorySchema);