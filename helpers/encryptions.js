import crypto from 'crypto';

import { ENCRYPTION_KEY, IV_LENGTH } from '../utils/constant.js';
const E_KEY = process.env.ENCRYPTION_KEY || ENCRYPTION_KEY; // Must be 256 bits (32 characters)
const IV_L = process.env.IV_LENGTH || IV_LENGTH;

export const encrypt = (text) => {
    let iv = crypto.randomBytes(IV_L);
    let cipher = crypto.createCipheriv(
        'aes-256-cbc',
        Buffer.from(E_KEY),
        iv,
    );
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
}

export const decrypt = (text) => {
    let textParts = text.split(':');
    let iv = Buffer.from(textParts.shift(), 'hex');
    let encryptedText = Buffer.from(textParts.join(':'), 'hex');
    let decipher = crypto.createDecipheriv(
        'aes-256-cbc',
        Buffer.from(E_KEY),
        iv,
    );
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}