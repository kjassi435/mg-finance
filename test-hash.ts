import bcrypt from 'bcryptjs';

async function test() {
  const hash = '$2b$12$SaKOF8iXaNFzzYILiorBDOh1HLAXWqsj50Ilzbd1UB0bMgTwi0gTu';
  const match = await bcrypt.compare('admin123', hash);
  console.log('Match admin123:', match);
}

test();
