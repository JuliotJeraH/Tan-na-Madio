const bcrypt = require('bcrypt');
const { query } = require('../src/config/db');

(async () => {
  try {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    // Check if admin already exists
    const check = await query(
      'SELECT id FROM utilisateurs WHERE email = $1',
      ['admin@tananamadio.mg']
    );
    
    if (check.rows.length > 0) {
      console.log('✅ Admin user already exists');
      process.exit(0);
    }
    
    // Create admin user
    const result = await query(
      'INSERT INTO utilisateurs (nom, prenom, email, mot_de_passe, role) VALUES ($1, $2, $3, $4, $5) RETURNING id, email, role',
      ['Admin', 'Système', 'admin@tananamadio.mg', hashedPassword, 'administrateur']
    );
    
    console.log('✅ Admin user created:', result.rows[0]);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
})();
