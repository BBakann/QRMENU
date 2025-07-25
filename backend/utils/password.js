import bcrypt from 'bcrypt';
import config from '../config/config.js';

// Salt rounds'u config'den al
const SALT_ROUNDS = config.security.bcryptSaltRounds;

// Şifreyi hashle
export const hashPassword = async (plainPassword) => {
  try {
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    const hashedPassword = await bcrypt.hash(plainPassword, salt);
    return hashedPassword;
  } catch (error) {
    throw new Error('Şifre hashlenirken hata oluştu');
  }
};

// Şifreyi doğrula
export const comparePassword = async (plainPassword, hashedPassword) => {
  try {
    return await bcrypt.compare(plainPassword, hashedPassword);
  } catch (error) {
    throw new Error('Şifre doğrulanırken hata oluştu');
  }
};

// Admin şifresi oluşturmak için
export const generateAdminPassword = async (plainPassword) => {
  const hashed = await hashPassword(plainPassword);
  console.log(`Plain: ${plainPassword}`);
  console.log(`Hashed: ${hashed}`);
  return hashed;
}; 