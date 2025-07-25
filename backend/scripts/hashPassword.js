import { generateAdminPassword } from '../utils/password.js';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const hashPassword = () => {
  rl.question('Admin şifresini girin: ', async (password) => {
    try {
      const hashedPassword = await generateAdminPassword(password);
      
      console.log('\n=== .env Dosyasına Eklenecek Satır ===');
      console.log(`ADMIN_PASSWORD_HASH=${hashedPassword}`);
      console.log('\n🔒 Bu hash\'i .env dosyasındaki ADMIN_PASSWORD_HASH değerine kopyalayın.');
    } catch (error) {
      console.error('Hata:', error.message);
    }
    
    rl.close();
  });
};

hashPassword(); 

