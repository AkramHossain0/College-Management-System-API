import crypto from 'crypto';

const algorithm = 'aes-256-cbc';

export const encryptAES = (text, secret) => {
  const iv = crypto.randomBytes(16);
  const key = crypto.createHash('sha256').update(secret).digest();
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
  return { iv: iv.toString('hex'), encryptedData: encrypted.toString('hex') };
};

export const decryptAES = (encrypted, secret, iv) => {
  const key = crypto.createHash('sha256').update(secret).digest();
  const decipher = crypto.createDecipheriv(algorithm, key, Buffer.from(iv, 'hex'));
  const decrypted = Buffer.concat([decipher.update(Buffer.from(encrypted, 'hex')), decipher.final()]);
  return decrypted.toString('utf8');
};
