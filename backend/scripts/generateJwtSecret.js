import crypto from 'crypto';

const generateJwtSecret = () => {
  // 64 karakter uzunluğunda rastgele string
  const secret = crypto.randomBytes(64).toString('hex');
  
  console.log('\n🔐 JWT SECRET KEY oluşturuldu:');
  console.log(`JWT_SECRET=${secret}`);
  console.log('\n📋 Bu key\'i .env dosyasına kopyalayın');
  console.log('⚠️  Bu key\'i kimseyle paylaşmayın ve Git\'e commit etmeyin!');
  console.log(`📏 Uzunluk: ${secret.length} karakter`);
};

generateJwtSecret(); 