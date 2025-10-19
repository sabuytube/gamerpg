import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGO_URI;
const MONGO_DB_NAME = process.env.MONGO_DB_NAME;

if (!MONGO_URI) {
  throw new Error('กรุณากำหนดตัวแปร MONGO_URI ในไฟล์ environment');
}

if (!MONGO_DB_NAME) {
  throw new Error('กรุณากำหนดตัวแปร MONGO_DB_NAME ในไฟล์ environment');
}

const globalCache = globalThis.mongooseCache ?? { conn: null, promise: null };

if (!globalThis.mongooseCache) {
  globalThis.mongooseCache = globalCache;
}

export async function connectDB() {
  if (globalCache.conn) {
    return globalCache.conn;
  }

  if (!globalCache.promise) {
    mongoose.set('strictQuery', true);
    globalCache.promise = mongoose.connect(MONGO_URI, {
      dbName: MONGO_DB_NAME,
    });
  }

  globalCache.conn = await globalCache.promise;
  return globalCache.conn;
}

// ======================= MongoDB Helper Functions =======================

/**
 * Get database instance
 */
const getDB = async () => {
  await connectDB();
  return mongoose.connection.db;
};

/**
 * Convert string ID to ObjectId (if needed)
 */
const toObjectId = (id) => {
  if (!id) return id;
  if (id instanceof mongoose.Types.ObjectId) return id;
  if (typeof id === 'string' && mongoose.Types.ObjectId.isValid(id)) {
    return new mongoose.Types.ObjectId(id);
  }
  return id;
};

/**
 * Process query to convert _id strings to ObjectId
 */
const processQuery = (query) => {
  if (!query || typeof query !== 'object') return query;

  const processed = Array.isArray(query) ? [] : {};

  const convertValue = (val) => {
    // Convert single id-like strings to ObjectId if valid
    if (typeof val === 'string' && mongoose.Types.ObjectId.isValid(val)) {
      return new mongoose.Types.ObjectId(val);
    }
    // Convert arrays of ids
    if (Array.isArray(val)) {
      return val.map(v => convertValue(v));
    }
    // Leave other types as-is
    return val;
  };

  for (const [key, value] of Object.entries(query)) {
    // Handle operators like $or, $and, $in, etc.
    if (key === '$or' || key === '$and' || key === '$nor') {
      processed[key] = Array.isArray(value) ? value.map(processQuery) : value;
      continue;
    }

    if (key === '$in' || key === '$nin') {
      // value should be an array
      processed[key] = Array.isArray(value) ? value.map(convertValue) : value;
      continue;
    }

    // If the value is an object (e.g., { $in: [...] } or nested query), recurse
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      processed[key] = processQuery(value);
      continue;
    }

    // Convert keys that represent ObjectId references:
    // _id, id, or any key that ends with 'Id' (e.g., userId, accountId)
    if (key === '_id' || key === 'id' || key.endsWith('Id')) {
      processed[key] = convertValue(value);
      continue;
    }

    // Default: copy value
    processed[key] = value;
  }

  return processed;
};

/**
 * Build MongoDB query from options
 */
const buildMongoQuery = (options = {}) => {
  const {
    where = {},
    like = {},
    inList = {},
    all = false,
  } = options;

  if (all) {
    return {};
  }

  let query = {};

  // WHERE conditions (exact match)
  for (const [key, value] of Object.entries(where)) {
    query[key] = value;
  }

  // LIKE conditions (regex)
  for (const [key, value] of Object.entries(like)) {
    query[key] = { $regex: value, $options: 'i' };
  }

  // IN conditions
  for (const [key, list] of Object.entries(inList)) {
    if (Array.isArray(list) && list.length > 0) {
      query[key] = { $in: list };
    }
  }

  // Process query to handle ObjectId conversion
  query = processQuery(query);

  return query;
};

/**
 * Build MongoDB sort from orderBy string
 * @param {string} orderBy - e.g., 'created_at DESC' or 'name ASC, age DESC'
 */
const buildMongoSort = (orderBy = '') => {
  if (!orderBy) return {};

  const sort = {};
  const parts = orderBy.split(',').map(s => s.trim());

  for (const part of parts) {
    const [field, direction] = part.split(/\s+/);
    if (field) {
      sort[field] = direction?.toUpperCase() === 'DESC' ? -1 : 1;
    }
  }

  return sort;
};

/**
 * ดึงข้อมูลจาก collection
 * @param {string} collection - ชื่อ collection
 * @param {Object} options - ตัวเลือกการค้น��า
 * @returns {Promise<{status: boolean, data?: Array, message?: string}>}
 */
export const getData = async (collection, options = {}) => {
  try {
    const db = await getDB();
    const {
      where = {},
      like = {},
      inList = {},
      all = false,
      orderBy = '',
      limit = null,
      offset = null,
    } = options;
    const query = buildMongoQuery({ where, like, inList, all });
    const sort = buildMongoSort(orderBy);

    let cursor = db.collection(collection).find(query);
    if (Object.keys(sort).length > 0) {
      cursor = cursor.sort(sort);
    }

    if (offset !== null) {
      cursor = cursor.skip(offset);
    }

    if (limit !== null) {
      cursor = cursor.limit(limit);
    }

    const data = await cursor.toArray();
    return { status: true, data };
  } catch (error) {
    console.error('❌ Error getting data:', error.message);
    return { status: false, message: error.message };
  }
};

/**
 * เพิ่���ข้อมูล 1 รายการ
 * @param {string} collection - ชื่อ collection
 * @param {Object} field - ข้อมูลที่จะเพิ่ม
 * @returns {Promise<{status: boolean, id?: string, message?: string}>}
 */
export const insertData = async (collection, field) => {
  try {
    const db = await getDB();
    const result = await db.collection(collection).insertOne(field);

    return {
      status: true,
      id: result.insertedId.toString(),
      insertedId: result.insertedId,
    };
  } catch (error) {
    console.error('❌ Error saving data:', error.message);
    return { status: false, message: error.message };
  }
};

/**
 * เพิ่���ข้อมูลหลายรายการพร้อมกัน
 * @param {string} collection - ชื่อ collection
 * @param {Array<Object>} dataArray - อ��ร์เรย์ข���งข้อมูลที่จะเพิ่��
 * @returns {Promise<{status: boolean, affectedRows?: number, message?: string}>}
 */
export const insertDataArray = async (collection, dataArray) => {
  try {
    if (!dataArray || dataArray.length === 0) {
      throw new Error('dataArray is empty');
    }

    const db = await getDB();
    const result = await db.collection(collection).insertMany(dataArray);

    return {
      status: true,
      affectedRows: result.insertedCount,
      insertedIds: result.insertedIds,
    };
  } catch (error) {
    console.error('❌ Error saving bulk data:', error.message);
    return { status: false, message: error.message };
  }
};

/**
 * แก้ไขข้อมูล 1 รายการ
 * @param {string} collection - ชื่อ collection
 * @param {Object} field - ข้อมูลที่จะอัปเดต
 * @param {Object} where - เงื่อนไขในการค้นหา
 * @returns {Promise<{status: boolean, affectedRows?: number, message?: string}>}
 */
export const updateData = async (collection, field, where) => {
  try {
    const db = await getDB();

    // Process where clause to handle ObjectId conversion
    const processedWhere = processQuery(where);

    // Build update object with $set
    const update = { $set: field };

    const result = await db.collection(collection).updateMany(processedWhere, update);

    return {
      status: true,
      affectedRows: result.modifiedCount,
      matchedCount: result.matchedCount,
    };
  } catch (error) {
    console.error('❌ Error updating data:', error.message);
    return { status: false, message: error.message };
  }
};

/**
 * แก้ไขข้อมูลหลายรายการพร้อมกัน (bulk update)
 * @param {string} collection - ชื่อ collection
 * @param {Array<Object>} dataArray - อาร์เรย์ของข้อม��ลที่จะอัปเดต
 * @param {string} primaryKey - ชื่อฟิลด์ที่ใช้เป็น primary key (default: '_id')
 * @returns {Promise<{status: boolean, affectedRows?: number, message?: string}>}
 */
export const updateDataArray = async (collection, dataArray, primaryKey = '_id') => {
  try {
    if (!dataArray || dataArray.length === 0) {
      throw new Error('dataArray is empty');
    }

    const db = await getDB();

    // Build bulk write operations
    const operations = dataArray.map(item => {
      const filter = { [primaryKey]: item[primaryKey] };
      const updateDoc = { ...item };
      delete updateDoc[primaryKey]; // Remove primary key from update fields

      return {
        updateOne: {
          filter,
          update: { $set: updateDoc },
        },
      };
    });

    const result = await db.collection(collection).bulkWrite(operations);

    return {
      status: true,
      affectedRows: result.modifiedCount,
      matchedCount: result.matchedCount,
    };
  } catch (error) {
    console.error('❌ Error bulk updating data:', error.message);
    return { status: false, message: error.message };
  }
};

/**
 * ลบข้อมูล
 * @param {string} collection - ชื่อ collection
 * @param {Object} where - เงื่อนไขในการลบ
 * @returns {Promise<{status: boolean, affectedRows?: number, message?: string}>}
 */
export const deleteData = async (collection, where) => {
  try {
    const db = await getDB();

    // Process where clause to handle ObjectId conversion
    const processedWhere = processQuery(where);

    const result = await db.collection(collection).deleteMany(processedWhere);

    return {
      status: true,
      affectedRows: result.deletedCount,
    };
  } catch (error) {
    console.error('❌ Error deleting data:', error.message);
    return { status: false, message: error.message };
  }
};

/**
 * ลบ collection (เทียบเท่า DROP TABLE)
 * @param {string} collectionName - ชื่อ collection
 * @returns {Promise<{status: boolean, message: string}>}
 */
export const dropCollection = async (collectionName) => {
  try {
    const db = await getDB();
    await db.collection(collectionName).drop();

    return {
      status: true,
      message: `Collection \`${collectionName}\` dropped successfully.`,
    };
  } catch (error) {
    if (error.message.includes('ns not found')) {
      return {
        status: true,
        message: `Collection \`${collectionName}\` does not exist.`,
      };
    }
    console.error('❌ Error dropping collection:', error.message);
    return { status: false, message: error.message };
  }
};

/**
 * สร้าง collection พร้อม indexes (เทียบเท่า CREATE TABLE)
 * @param {string} collectionName - ชื่อ collection
 * @param {Object} schema - schema definition (สำหรับสร้าง indexes)
 * @returns {Promise<{status: boolean, message: string}>}
 */
export const createCollection = async (collectionName, schema = {}) => {
  try {
    const db = await getDB();

    // Create collection if not exists
    const collections = await db.listCollections({ name: collectionName }).toArray();

    if (collections.length === 0) {
      await db.createCollection(collectionName);
    }

    // Create indexes based on schema if provided
    // Schema format: { fieldName: 'index_type' } e.g., { email: 'unique', createdAt: 'index' }
    if (schema && Object.keys(schema).length > 0) {
      const indexSpecs = [];

      for (const [field, type] of Object.entries(schema)) {
        if (type === 'unique') {
          indexSpecs.push({ key: { [field]: 1 }, unique: true });
        } else if (type === 'index') {
          indexSpecs.push({ key: { [field]: 1 } });
        } else if (type === 'text') {
          indexSpecs.push({ key: { [field]: 'text' } });
        }
      }

      if (indexSpecs.length > 0) {
        for (const spec of indexSpecs) {
          await db.collection(collectionName).createIndex(spec.key, spec.unique ? { unique: true } : {});
        }
      }
    }

    return {
      status: true,
      message: `Collection \`${collectionName}\` created successfully.`,
    };
  } catch (error) {
    console.error('❌ Error creating collection:', error.message);
    return { status: false, message: error.message };
  }
};

/**
 * ดึงรายชื่อ collections ทั้งหมด (เทียบเท่า SHOW TABLES)
 * @returns {Promise<{status: boolean, data?: Array, message?: string}>}
 */
export const getCollections = async () => {
  try {
    const db = await getDB();
    const collections = await db.listCollections().toArray();

    const data = collections.map(col => ({ collection_name: col.name }));

    return { status: true, data };
  } catch (error) {
    console.error('❌ Error fetching collections:', error.message);
    return { status: false, message: error.message };
  }
};

/**
 * ดึงข้อมูล indexes ของ collection (เทียบเท่า SHOW COLUMNS)
 * @param {string} collectionName - ชื่อ collection
 * @returns {Promise<{status: boolean, data?: Array, message?: string}>}
 */
export const getIndexes = async (collectionName) => {
  try {
    const db = await getDB();
    const indexes = await db.collection(collectionName).indexes();

    return { status: true, data: indexes };
  } catch (error) {
    console.error(`❌ Error fetching indexes for collection ${collectionName}:`, error.message);
    return { status: false, message: error.message };
  }
};

/**
 * นับจำนวนเอกสารใน collection
 * @param {string} collection - ชื่อ collection
 * @param {Object} options - ตัวเลือกการค้น��า (where, like, inList)
 * @returns {Promise<{status: boolean, count?: number, message?: string}>}
 */
export const countData = async (collection, options = {}) => {
  try {
    const db = await getDB();
    const { where = {}, like = {}, inList = {}, all = false } = options;

    const query = buildMongoQuery({ where, like, inList, all });
    const count = await db.collection(collection).countDocuments(query);

    return { status: true, count };
  } catch (error) {
    console.error('❌ Error counting data:', error.message);
    return { status: false, message: error.message };
  }
};

/**
 * Aggregate data (for complex queries)
 * @param {string} collection - ชื่อ collection
 * @param {Array} pipeline - MongoDB aggregation pipeline
 * @returns {Promise<{status: boolean, data?: Array, message?: string}>}
 */
export const aggregateData = async (collection, pipeline) => {
  try {
    const db = await getDB();
    const data = await db.collection(collection).aggregate(pipeline).toArray();

    return { status: true, data };
  } catch (error) {
    console.error('❌ Error aggregating data:', error.message);
    return { status: false, message: error.message };
  }
};

// ======================= ตัวอย่างการใช้งาน =======================

// 1. ดึงข้อมูลทั้งหมด
// await getData('users', { all: true });

// 2. ดึงข้อมูลแบบ WHERE เฉพาะ _id
// await getData('users', { where: { _id: new ObjectId('...') } });

// 3. ค้นหาด้วย LIKE (regex)
// await getData('users', { like: { name: 'john' } });

// 4. WHERE IN (หลายค่า)
// await getData('users', { inList: { _id: [id1, id2, id3] } });

// 5. LIMIT + ORDER BY
// await getData('users', { where: { status: 'active' }, orderBy: 'created_at DESC', limit: 10 });

// 6. เพิ่มข้อมูล 1 รายการ
// await insertData('users', { name: 'John', age: 30 });

// 7. เพิ่มข้อมูลหลายรายการ
// await insertDataArray('users', [
//   { name: 'Alice', age: 28 },
//   { name: 'Bob', age: 35 }
// ]);

// 8. แก้ไขข้อมูล
// await updateData('users', { age: 31 }, { _id: new ObjectId('...') });

// 9. แก้ไขหลายรายการแบบ bulk update
// await updateDataArray('users', [
//   { _id: id1, age: 31 },
//   { _id: id2, age: 36 }
// ]);

// 10. ลบข้อมูลแบบเจาะจง
// await deleteData('users', { _id: new ObjectId('...') });

// 11. สร้าง collection พร้อม indexes
// await createCollection('users', {
//   email: 'unique',
//   createdAt: 'index',
//   name: 'text'
// });

// 12. นับจำนวนเอกสาร
// await countData('users', { where: { status: 'active' } });

// 13. Aggregate (ตัวอย่าง: group by และ count)
// await aggregateData('users', [
//   { $match: { status: 'active' } },
//   { $group: { _id: '$role', count: { $sum: 1 } } }
// ]);
