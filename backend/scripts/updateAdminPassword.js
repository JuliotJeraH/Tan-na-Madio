const bcrypt = require('bcrypt');
const { query } = require('../src/config/db');

(async () => {
  try {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    // Update admin password
    const result = await query(
      'UPDATE utilisateurs SET mot_de_passe = $1 WHERE email = $2 RETURNING id, email, role',
      [hashedPassword, 'admin@tananamadio.mg']
    );
    
    if (result.rows.length > 0) {
      console.log('✅ Admin password updated:', result.rows[0]);
    } else {
      console.log('❌ Admin user not found');
    }
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
})();
