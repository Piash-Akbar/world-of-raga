// src/lib/dataStore.ts
import fs from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'data.json');

// Initial structure if file doesn't exist
const defaultData = {
  practiceVideos: [],
  compositions: [],
  masterclasses: [],
  reels: [],
  products: [],
  userLibrary: [],
};

export type DataCollection = keyof typeof defaultData;

// Read the JSON file
function readData() {
  try {
    if (!fs.existsSync(dataFilePath)) {
      fs.writeFileSync(dataFilePath, JSON.stringify(defaultData, null, 2));
      return defaultData;
    }
    const raw = fs.readFileSync(dataFilePath, 'utf-8');
    const data = JSON.parse(raw);
    // Ensure all keys exist
    for (const key in defaultData) {
      if (!data[key]) data[key] = [];
    }
    return data;
  } catch (error) {
    console.error('Error reading data file:', error);
    return defaultData;
  }
}

// Write the JSON file
function writeData(data: any) {
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
}

// Generic CRUD helpers
export function getAll<T>(collection: DataCollection): T[] {
  const data = readData();
  return data[collection] as T[];
}

export function getById<T extends { id: string }>(
  collection: DataCollection,
  id: string
): T | null {
  const items = getAll<T>(collection);
  return items.find(item => item.id === id) || null;
}

export function createItem<T extends { id: string }>(
  collection: DataCollection,
  item: Omit<T, 'id'>
): T {
  const data = readData();
  const newItem = {
    ...item,
    id: Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
    createdAt: new Date().toISOString(),
  } as unknown as T;
  data[collection].push(newItem);
  writeData(data);
  return newItem;
}

export function updateItem<T extends { id: string }>(
  collection: DataCollection,
  id: string,
  updates: Partial<T>
): T | null {
  const data = readData();
  const items = data[collection] as T[];
  const index = items.findIndex(item => item.id === id);
  if (index === -1) return null;
  const updated = { ...items[index], ...updates };
  items[index] = updated;
  writeData(data);
  return updated;
}

export function deleteItem(collection: DataCollection, id: string): boolean {
  const data = readData();
  const items = data[collection];
  const initialLength = items.length;
  data[collection] = items.filter((item: any) => item.id !== id);
  if (data[collection].length === initialLength) return false;
  writeData(data);
  return true;
}