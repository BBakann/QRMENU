import Product from '../models/Product.js';

// Tüm ürünleri getir
export const getAllProducts = async (req, res) => {
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
};

// ID ile tek ürün getir
export const getProductById = async (req, res) => {
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
};

// Kategori bazında ürünler
export const getProductsByCategory = async (req, res) => {
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
};

// Yeni ürün ekle (ADMIN)
export const createProduct = async (req, res) => {
    try {
        console.log('🚀 BACKEND: createProduct çağrıldı');
        console.log('📥 Request Body:', req.body);
        console.log('👤 User:', req.user);
        
        const { name, description, price, category, popular, image } = req.body;
        
        console.log('🔍 Parsed values:');
        console.log('- name:', name);
        console.log('- description:', description);
        console.log('- price:', price);
        console.log('- category:', category);
        console.log('- popular:', popular);
        console.log('- image:', image);
        
        // Validation
        if (!name || !description || !price) {
            console.log('❌ BACKEND: Basic validation failed');
            return res.status(400).json({
                success: false,
                message: 'İsim, açıklama ve fiyat gereklidir!'
            });
        }
        
        const productData = {
            name,
            description,
            price: parseFloat(price),
            category: category || 'food',
            popular: popular || false,
            image: image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&h=400&fit=crop',
            createdBy: req.user.username,
            updatedBy: req.user.username
        };
        
        console.log('📋 Final product data:', productData);
        
        const newProduct = new Product(productData);
        console.log('🏗️ Product model created, attempting save...');

        const savedProduct = await newProduct.save();
        console.log('💾 Product saved successfully:', savedProduct._id);
        
        console.log(`✅ Admin ${req.user.username} yeni ürün ekledi: ${name}`);
        
        res.status(201).json({
            success: true,
            message: 'Ürün başarıyla eklendi',
            data: savedProduct
        });
    } catch (error) {
        console.error('❌ BACKEND: Product creation error:', error);
        console.error('❌ Error name:', error.name);
        console.error('❌ Error message:', error.message);
        
        // Mongoose validation errors
        if (error.name === 'ValidationError') {
            console.error('❌ Mongoose validation errors:', error.errors);
            return res.status(400).json({
                success: false,
                message: 'Validation hatası',
                errors: Object.values(error.errors).map(err => err.message)
            });
        }
        
        res.status(500).json({
            success: false,
            message: 'Ürün eklenirken hata oluştu',
            error: error.message
        });
    }
};

// Ürün güncelle (ADMIN)
export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        
        // Fiyat varsa number'a çevir
        if (updateData.price) {
            updateData.price = parseFloat(updateData.price);
        }
        
        updateData.updatedBy = req.user.username;
        
        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );
        
        if (!updatedProduct) {
            return res.status(404).json({
                success: false,
                message: 'Ürün bulunamadı'
            });
        }
        
        console.log(`✅ Admin ${req.user.username} ürün güncelledi: ${updatedProduct.name}`);
        
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
};

// Ürün sil (ADMIN)
export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        
        const deletedProduct = await Product.findByIdAndDelete(id);
        
        if (!deletedProduct) {
            return res.status(404).json({
                success: false,
                message: 'Ürün bulunamadı'
            });
        }
        
        console.log(`✅ Admin ${req.user.username} ürün sildi: ${deletedProduct.name}`);
        
        res.json({
            success: true,
            message: 'Ürün başarıyla silindi',
            data: { id: deletedProduct._id, name: deletedProduct.name }
        });
    } catch (error) {
        console.error('Product deletion error:', error);
        res.status(500).json({
            success: false,
            message: 'Ürün silinirken hata oluştu'
        });
    }
};

// Admin için tüm ürünleri getir (inactive dahil)
export const getAllProductsForAdmin = async (req, res) => {
    try {
        const products = await Product.find({})
            .sort({ popular: -1, createdAt: -1 });
        
        res.json({
            success: true,
            data: products,
            count: products.length
        });
    } catch (error) {
        console.error('Admin menu fetch error:', error);
        res.status(500).json({
            success: false,
            message: 'Menü yüklenirken hata oluştu'
        });
    }
}; 