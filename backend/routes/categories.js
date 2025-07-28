import express from 'express';
import { authenticateAdmin } from '../utils/jwt.js';
import Category from '../models/Category.js';

const router = express.Router();

// Tüm kategorileri getir - HERKESE AÇIK
router.get('/', async (req, res) => {
    try {
        const categories = await Category.find({ active: true })
            .sort({ sortOrder: 1, createdAt: 1 });

        res.json({
            success: true,
            data: categories,
            count: categories.length
        });
    } catch (error) {
        console.error('❌ Kategoriler yüklenirken hata:', error);
        res.status(500).json({
            success: false,
            message: 'Kategoriler yüklenirken hata oluştu'
        });
    }
});

// Admin için tüm kategorileri getir (inactive dahil)
router.get('/admin/all', authenticateAdmin, async (req, res) => {
    try {
        const categories = await Category.find({})
            .sort({ sortOrder: 1, createdAt: 1 });

        res.json({
            success: true,
            data: categories,
            count: categories.length
        });
    } catch (error) {
        console.error('❌ Admin kategoriler yüklenirken hata:', error);
        res.status(500).json({
            success: false,
            message: 'Kategoriler yüklenirken hata oluştu'
        });
    }
});

// Yeni kategori oluştur - SADECE ADMİN
router.post('/', authenticateAdmin, async (req, res) => {
    try {
        const { id, name, description, sortOrder } = req.body;

        // Validation
        if (!id || !name) {
            return res.status(400).json({
                success: false,
                message: 'ID ve isim gereklidir!'
            });
        }

        // ID benzersizlik kontrolü
        const existingCategory = await Category.findOne({ id: id.toLowerCase() });
        if (existingCategory) {
            return res.status(400).json({
                success: false,
                message: 'Bu ID ile kategori zaten mevcut!'
            });
        }

        const newCategory = new Category({
            id: id.toLowerCase().trim(),
            name: name.trim(),
            description: description?.trim() || '',
            sortOrder: sortOrder || 0,
            createdBy: req.user?.username || 'admin',
            updatedBy: req.user?.username || 'admin'
        });

        const savedCategory = await newCategory.save();

        console.log(`✅ Admin ${req.user?.username || 'admin'} yeni kategori ekledi: ${name}`);

        res.status(201).json({
            success: true,
            message: 'Kategori başarıyla oluşturuldu',
            data: savedCategory
        });
    } catch (error) {
        console.error('❌ Kategori oluşturulurken hata:', error);
        res.status(500).json({
            success: false,
            message: 'Kategori oluşturulurken hata oluştu'
        });
    }
});

// Kategori sil - SADECE ADMİN
router.delete('/:id', authenticateAdmin, async (req, res) => {
    try {
        const { id } = req.params;

        // Kategori var mı kontrol et
        const category = await Category.findOne({ id: id.toLowerCase() });
        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Kategori bulunamadı!'
            });
        }

        // Bu kategoriye ait ürün sayısını kontrol et
        const Product = (await import('../models/Product.js')).default;
        
        console.log(`🔍 Kategori siliniyor: ${id.toLowerCase()}`);
        
        // Önce bu kategorideki ürünleri listele
        const productsInCategory = await Product.find({ category: id.toLowerCase() });
        console.log(`🔍 Bu kategorideki ürünler:`, productsInCategory.map(p => ({ id: p._id, name: p.name, category: p.category })));
        
        const productCount = await Product.countDocuments({ category: id.toLowerCase() });
        console.log(`🔍 Silinecek ürün sayısı: ${productCount}`);
        
        // Kategoriyi sil
        await Category.findOneAndDelete({ id: id.toLowerCase() });
        
        // Bu kategoriye ait tüm ürünleri sil
        if (productCount > 0) {
            const deleteResult = await Product.deleteMany({ category: id.toLowerCase() });
            console.log(`✅ Silme sonucu:`, deleteResult);
            console.log(`✅ ${productCount} ürün kategorisiyle birlikte silindi`);
        }

        console.log(`✅ Admin ${req.user?.username || 'admin'} kategori sildi: ${category.name}`);

        res.json({
            success: true,
            message: `Kategori ve ${productCount} ürün başarıyla silindi`,
            data: { 
                id: category.id, 
                name: category.name,
                deletedProducts: productCount
            }
        });
    } catch (error) {
        console.error('❌ Kategori silinirken hata:', error);
        res.status(500).json({
            success: false,
            message: 'Kategori silinirken hata oluştu'
        });
    }
});

export default router;