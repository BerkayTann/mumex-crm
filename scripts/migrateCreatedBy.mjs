/**
 * Migration Script: Mevcut kayıtlara createdBy alanı ekler
 *
 * Kullanım:
 *   MONGODB_URI="mongodb+srv://..." node scripts/migrateCreatedBy.mjs
 *
 * Bu script, admin kullanıcısının _id'sini tüm mevcut kayıtlara createdBy olarak atar.
 */

import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('HATA: MONGODB_URI ortam değişkeni tanımlı değil.');
  console.error('Kullanım: MONGODB_URI="mongodb+srv://..." node scripts/migrateCreatedBy.mjs');
  process.exit(1);
}

const client = new MongoClient(MONGODB_URI);

async function migrate() {
  try {
    await client.connect();
    console.log('MongoDB bağlantısı kuruldu.');

    const db = client.db();

    // 1. Admin kullanıcısının _id'sini bul
    const adminKullanici = await db.collection('authusers').findOne({ username: 'admin' });

    if (!adminKullanici) {
      console.error('HATA: admin kullanıcısı bulunamadı. Önce uygulamaya giriş yapın.');
      process.exit(1);
    }

    const adminId = adminKullanici._id;
    console.log(`Admin kullanıcı bulundu: ${adminId}`);

    // 2. Tüm collection'larda createdBy olmayan kayıtları güncelle
    const collections = ['companies', 'users', 'products', 'visits', 'plans'];

    for (const collectionName of collections) {
      const result = await db.collection(collectionName).updateMany(
        { createdBy: { $exists: false } },
        { $set: { createdBy: adminId } }
      );
      console.log(`[${collectionName}] ${result.modifiedCount} kayıt güncellendi.`);
    }

    console.log('\nMigration tamamlandı!');
  } catch (hata) {
    console.error('Migration hatası:', hata);
    process.exit(1);
  } finally {
    await client.close();
  }
}

migrate();
