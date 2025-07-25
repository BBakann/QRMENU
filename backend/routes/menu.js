import express from 'express';
import { authenticateAdmin } from '../utils/jwt.js';
import Product from '../models/Product.js';

const router = express.Router();

// Tüm ürünleri getir - HERKESE AÇIK
router.get('/', async (req, res) => {
    try {
        const products = await Product.find({ available: true })
            .sort({ popular: -1, createdAt: -1 });
        
        res.json({
            success: true,
            data: products,
            count: products.length
        });
    } catch (error) {
        console.error('Menu fetch error:', error);
        res.status(500).json({
            success: false,
            message: 'Menü yüklenirken hata oluştu'
        });
    }
});

// ID ile tek ürün getir - HERKESE AÇIK
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Ürün bulunamadı'
            });
        }
        
        res.json({
            success: true,
            data: product
        });
    } catch (error) {
        console.error('Product fetch error:', error);
        res.status(500).json({
            success: false,
            message: 'Ürün yüklenirken hata oluştu'
        });
    }
});

// Kategori bazında ürünler - HERKESE AÇIK
router.get('/category/:category', async (req, res) => {
    try {
        const { category } = req.params;
        const products = await Product.find({ 
            category: category,
            available: true 
        }).sort({ popular: -1, createdAt: -1 });
        
        res.json({
            success: true,
            category: category,
            data: products,
            count: products.length
        });
    } catch (error) {
        console.error('Category fetch error:', error);
        res.status(500).json({
            success: false,
            message: 'Kategori yüklenirken hata oluştu'
        });
    }
});

// ADMIN ROUTES - TOKEN GEREKLİ

// Yeni ürün ekle - SADECE ADMİN
router.post('/', authenticateAdmin, async (req, res) => {
    try {
        const { name, description, price, category, popular, image } = req.body;
        
        // Validation
        if (!name || !description || !price) {
            return res.status(400).json({
                success: false,
                message: 'İsim, açıklama ve fiyat gereklidir!'
            });
        }
        
        const newProduct = new Product({
            name,
            description,
            price: parseFloat(price),
            category: category || 'food',
            popular: popular || false,
            image: image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&h=400&fit=crop',
            createdBy: req.user.username,
            updatedBy: req.user.username
        });
        
        const savedProduct = await newProduct.save();
        
        console.log(`✅ Admin ${req.user.username} yeni ürün ekledi: ${name}`);
        
        res.status(201).json({
            success: true,
            message: 'Ürün başarıyla eklendi',
            data: savedProduct
        });
    } catch (error) {
        console.error('Product creation error:', error);
        res.status(500).json({
            success: false,
            message: 'Ürün eklenirken hata oluştu'
        });
    }
});

// Ürün güncelle - SADECE ADMİN
router.put('/:id', authenticateAdmin, async (req, res) => {
    try {
        const { name, description, price, category, popular, available, image } = req.body;
        
        const product = await Product.findById(req.params.id);
        
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Ürün bulunamadı'
            });
        }
        
        // Update fields
        if (name) product.name = name;
        if (description) product.description = description;
        if (price) product.price = parseFloat(price);
        if (category) product.category = category;
        if (popular !== undefined) product.popular = popular;
        if (available !== undefined) product.available = available;
        if (image) product.image = image;
        
        product.updatedBy = req.user.username;
        
        const updatedProduct = await product.save();
        
        console.log(`✅ Admin ${req.user.username} ürün güncelledi: ${product.name}`);
        
        res.json({
            success: true,
            message: 'Ürün başarıyla güncellendi',
            data: updatedProduct
        });
    } catch (error) {
        console.error('Product update error:', error);
        res.status(500).json({
            success: false,
            message: 'Ürün güncellenirken hata oluştu'
        });
    }
});

// Sadece fiyat güncelle - SADECE ADMİN
router.patch('/:id/price', authenticateAdmin, async (req, res) => {
    try {
        const { price } = req.body;
        
        if (!price || price <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Geçerli bir fiyat giriniz!'
            });
        }
        
        const product = await Product.findById(req.params.id);
        
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Ürün bulunamadı'
            });
        }
        
        const oldPrice = product.price;
        product.price = parseFloat(price);
        product.updatedBy = req.user.username;
        
        await product.save();
        
        console.log(`💰 Admin ${req.user.username} fiyat güncelledi: ${product.name} (${oldPrice}₺ → ${price}₺)`);
        
        res.json({
            success: true,
            message: `Fiyat ${oldPrice}₺'den ${price}₺'ye güncellendi`,
            data: product
        });
    } catch (error) {
        console.error('Price update error:', error);
        res.status(500).json({
            success: false,
            message: 'Fiyat güncellenirken hata oluştu'
        });
    }
});

// Ürün sil - SADECE ADMİN
router.delete('/:id', authenticateAdmin, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Ürün bulunamadı'
            });
        }
        
        await Product.findByIdAndDelete(req.params.id);
        
        console.log(`🗑️  Admin ${req.user.username} ürün sildi: ${product.name}`);
        
        res.json({
            success: true,
            message: `"${product.name}" başarıyla silindi`,
            data: product
        });
    } catch (error) {
        console.error('Product deletion error:', error);
        res.status(500).json({
            success: false,
            message: 'Ürün silinirken hata oluştu'
        });
    }
});

// Admin için tüm ürünleri getir (available: false olanlar dahil)
router.get('/admin/all', authenticateAdmin, async (req, res) => {
    try {
        const products = await Product.find({})
            .sort({ createdAt: -1 });
        
        res.json({
            success: true,
            data: products,
            count: products.length
        });
    } catch (error) {
        console.error('Admin products fetch error:', error);
        res.status(500).json({
            success: false,
            message: 'Ürünler yüklenirken hata oluştu'
        });
    }
});

export default router;