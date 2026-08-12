const bcrypt = require('bcryptjs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('=================================');
console.log('  Password Hash Generator');
console.log('=================================\n');

rl.question('Enter password to hash: ', (password) => {
  if (!password) {
    console.log('Error: Password cannot be empty');
    rl.close();
    return;
  }

  bcrypt.hash(password, 10).then(hash => {
    console.log('\n✓ Password hashed successfully!\n');
    console.log('PASSWORD: ' + password);
    console.log('HASH:     ' + hash);
    console.log('\nUse this hash in your database UPDATE query:');
    console.log(`UPDATE admins SET password_hash = '${hash}' WHERE id = 1;\n`);
    rl.close();
  }).catch(err => {
    console.error('Error hashing password:', err);
    rl.close();
  });
});

