import express from 'express';
import multer from 'multer';
import cloudinary from '../config/cloudinary.js';
import { authenticateAdmin } from '../utils/jwt.js';

const router = express.Router();

// Multer configuration - memory storage için
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
    },
    fileFilter: (req, file, cb) => {
        // Sadece resim dosyalarına izin ver
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Sadece resim dosyaları yüklenebilir'), false);
        }
    }
});

// Resim yükleme route'u - SADECE ADMİN
router.post('/', authenticateAdmin, upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'Resim dosyası seçilmedi'
            });
        }

        console.log('📷 Resim yükleniyor...', req.file.originalname);

        // Cloudinary'ye upload
        const uploadResult = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                {
                    folder: 'qrmenu/products', // Klasör organizasyonu
                    transformation: [
                        { width: 800, height: 600, crop: 'fill' }, // Otomatik resize
                        { quality: 'auto', fetch_format: 'auto' } // Otomatik optimize
                    ]
                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            ).end(req.file.buffer);
        });

        console.log('✅ Resim başarıyla yüklendi:', uploadResult.secure_url);

        res.json({
            success: true,
            message: 'Resim başarıyla yüklendi',
            data: {
                url: uploadResult.secure_url,
                public_id: uploadResult.public_id,
                width: uploadResult.width,
                height: uploadResult.height
            }
        });

    } catch (error) {
        console.error('❌ Resim yükleme hatası:', error);
        res.status(500).json({
            success: false,
            message: 'Resim yüklenirken hata oluştu',
            error: error.message
        });
    }
});

// Resim silme route'u - SADECE ADMİN
router.delete('/:public_id', authenticateAdmin, async (req, res) => {
    try {
        const { public_id } = req.params;
        
        // Cloudinary'den sil
        const deleteResult = await cloudinary.uploader.destroy(`qrmenu/products/${public_id}`);
        
        console.log('🗑️ Resim silindi:', public_id);

        res.json({
            success: true,
            message: 'Resim başarıyla silindi',
            data: deleteResult
        });

    } catch (error) {
        console.error('❌ Resim silme hatası:', error);
        res.status(500).json({
            success: false,
            message: 'Resim silinirken hata oluştu',
            error: error.message
        });
    }
});

export default router; 