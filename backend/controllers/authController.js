import { generateToken, authenticateAdmin } from '../utils/jwt.js';
import { comparePassword, hashPassword } from '../utils/password.js';
import config from '../config/config.js';

// Admin bilgileri - TAMAMEN .env'den
const ADMIN_USER = {
    id: 1,
    username: config.admin.username,
    password: config.admin.passwordHash, // Artık .env'den geliyor
    email: config.admin.email,
    role: 'admin'
};

// Admin giriş
export const adminLogin = async (req, res) => {
    const { username, password } = req.body;
    
    // Ekstra güvenlik kontrolü: Input type validation
    if (typeof username !== 'string' || typeof password !== 'string') {
        // Production'da sadece critical güvenlik logları
        if (process.env.NODE_ENV === 'production') {
            console.warn(`Security: Invalid input types from IP: ${req.ip}`);
        }
        return res.status(400).json({
            success: false,
            message: 'Geçersiz giriş bilgileri formatı'
        });
    }
    
    try {
        // Kullanıcı adı kontrolü
        if (username !== ADMIN_USER.username) {
            return res.status(401).json({ 
                success: false, 
                message: 'Kullanıcı adı veya şifre yanlış!' 
            });
        }
        
        // Şifre kontrolü - bcrypt ile compare
        const isPasswordValid = await comparePassword(password, ADMIN_USER.password);
        
        if (!isPasswordValid) {
            // Failed login sadece production'da log
            if (process.env.NODE_ENV === 'production') {
                console.warn(`Security: Failed login attempt for ${username} from ${req.ip}`);
            }
            return res.status(401).json({ 
                success: false, 
                message: 'Kullanıcı adı veya şifre yanlış!' 
            });
        }
        
        // JWT token oluştur
        const token = generateToken({
            id: ADMIN_USER.id,
            username: ADMIN_USER.username,
            email: ADMIN_USER.email,
            role: ADMIN_USER.role
        });
        
        // Success login - production'da log
        if (process.env.NODE_ENV === 'production') {
            console.log(`Admin login successful: ${username} from ${req.ip}`);
        }
        
        // Token'ı SESSION COOKIE olarak set et
        res.cookie('adminToken', token, {
            httpOnly: true,           // XSS koruması
            secure: process.env.NODE_ENV === 'production', // HTTPS only in prod
            sameSite: 'strict',       // CSRF koruması
            // maxAge KALDIRILDI = tarayıcı kapanınca silinir
            path: '/'
        });
        
        res.json({ 
            success: true, 
            message: 'Giriş başarılı!',
            user: {
                id: ADMIN_USER.id,
                username: ADMIN_USER.username,
                email: ADMIN_USER.email,
                role: ADMIN_USER.role
            }
        });
        
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Sunucu hatası'
        });
    }
};

// Admin çıkış işlemi - GÜÇLENDİRİLMİŞ
export const adminLogout = async (req, res) => {
    try {
        // adminToken çerezini tamamen temizle - MULTIPLE METHODS
        res.clearCookie('adminToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/'
        });
        
        // Ek temizlik - farklı path'ler için
        res.clearCookie('adminToken');
        
        // Expired cookie set et (extra güvenlik)
        res.cookie('adminToken', '', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/',
            expires: new Date(0) // Geçmişte bir tarih = hemen sil
        });
        
        res.json({
            success: true,
            message: 'Başarıyla çıkış yapıldı!'
        });
        
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({
            success: false,
            message: 'Çıkış yapılırken hata oluştu!'
        });
    }
};

// Admin profil bilgisi
export const getAdminProfile = (req, res) => {
    res.json({
        success: true,
        user: req.user,
        message: 'Admin profil bilgileri başarıyla alındı'
    });
};

// Token doğrulama
export const verifyToken = (req, res) => {
    res.json({
        success: true,
        message: 'Token geçerli',
        user: req.user
    });
};

// Şifre değiştirme - yeni hash'i konsola yazdırır
export const changePassword = async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    
    try {
        // Mevcut şifreyi doğrula
        const isCurrentPasswordValid = await comparePassword(currentPassword, ADMIN_USER.password);
        
        if (!isCurrentPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Mevcut şifre yanlış!'
            });
        }
        
        // Yeni şifreyi hashle
        const hashedNewPassword = await hashPassword(newPassword);
        
        console.log('🔄 Yeni şifre hash\'i (bunu .env dosyasına kopyala):');
        console.log(`ADMIN_PASSWORD_HASH=${hashedNewPassword}`);
        
        res.json({
            success: true,
            message: 'Şifre başarıyla değiştirildi. Yeni hash konsola yazdırıldı.'
        });
        
    } catch (error) {
        console.error('Password change error:', error);
        res.status(500).json({
            success: false,
            message: 'Şifre değiştirilirken hata oluştu'
        });
    }
};

 