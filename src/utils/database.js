import initSqlJs from 'sql.js';

let SQL = null;
let db = null;
let isLoading = false;
let loadPromise = null;
const queryCache = new Map();
const CACHE_EXPIRY = 5 * 60 * 1000; // 5 minutes

const initDatabase = async (onProgress) => {
  if (db) return db;
  if (loadPromise) return loadPromise;
  
  isLoading = true;
  
  loadPromise = (async () => {
    try {
      console.log('Initializing SQL.js...');
      SQL = await initSqlJs({
        locateFile: file => `https://sql.js.org/dist/${file}`
      });

      console.log('Downloading database');
      const response = await fetch('https://uvnmetoqxxfxmvyvcphu.supabase.co/storage/v1/object/public/posts/nba_db/nba_historical_stats.db');
      if (!response.ok) {
        throw new Error(`Failed to load database: ${response.status} ${response.statusText}`);
      }
      
      const contentLength = response.headers.get('content-length');
      const total = parseInt(contentLength, 10);
      let loaded = 0;
      
      const reader = response.body.getReader();
      const chunks = [];
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        chunks.push(value);
        loaded += value.length;
        
        if (onProgress && total) {
          const progress = (loaded / total) * 100;
          onProgress(progress);
        }
      }
      
      const buffer = new Uint8Array(loaded);
      let position = 0;
      for (const chunk of chunks) {
        buffer.set(chunk, position);
        position += chunk.length;
      }
      
      console.log('Initializing database in memory...');
      db = new SQL.Database(buffer);
      
      console.log('Database loaded successfully!');
      isLoading = false;
      return db;
    } catch (error) {
      console.error('Error loading database:', error);
      isLoading = false;
      throw error;
    }
  })();
  
  return loadPromise;
};

export const executeQuery = async (query, params = [], useCache = true) => {
  const database = await initDatabase();
  
  const cacheKey = `${query}:${JSON.stringify(params)}`;
  
  if (useCache && queryCache.has(cacheKey)) {
    const cached = queryCache.get(cacheKey);
    if (Date.now() - cached.timestamp < CACHE_EXPIRY) {
      console.log('Using cached query result');
      return cached.data;
    }
    queryCache.delete(cacheKey);
  }
  
  try {
    const results = [];
    const stmt = database.prepare(query);
    
    if (params.length > 0) {
      stmt.bind(params);
    }
    
    while (stmt.step()) {
      const row = stmt.getAsObject();
      results.push(row);
    }
    
    stmt.free();
    
    if (useCache) {
      queryCache.set(cacheKey, {
        data: results,
        timestamp: Date.now()
      });
      
      if (queryCache.size > 100) {
        const firstKey = queryCache.keys().next().value;
        queryCache.delete(firstKey);
      }
    }
    
    return results;
  } catch (error) {
    console.error('Query execution error:', error);
    console.error('Query:', query);
    console.error('Params:', params);
    throw error;
  }
};

export const getDatabase = async () => {
  return await initDatabase();
};

export const getDatabaseStatus = () => {
  return {
    isLoaded: db !== null,
    isLoading,
    cacheSize: queryCache.size
  };
};

export const clearQueryCache = () => {
  queryCache.clear();
  console.log('Query cache cleared');
};

export { initDatabase };

export default {
  initDatabase,
  executeQuery,
  getDatabase,
  getDatabaseStatus,
  clearQueryCache
};

