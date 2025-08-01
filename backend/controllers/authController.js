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
    
    console.log('Admin login attempt for user:', username);
    
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
            console.log('Failed login attempt - wrong password');
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
        
        console.log(`✅ Admin ${username} başarıyla giriş yaptı`);
        
        res.json({ 
            success: true, 
            message: 'Giriş başarılı!',
            token: token,
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

// Admin logout
export const adminLogout = (req, res) => {
    console.log(`👋 Admin ${req.user.username} çıkış yaptı`);
    res.json({
        success: true,
        message: 'Çıkış başarılı'
    });
}; 