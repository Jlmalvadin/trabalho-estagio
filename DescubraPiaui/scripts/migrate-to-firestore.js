const { db } = require('../lib/firebase');
const { collection, addDoc } = require('firebase/firestore');
const pointsData = require('../data/points.json');

async function migrate() {
  const pointsRef = collection(db, 'points');
  
  for (const point of pointsData) {
    await addDoc(pointsRef, {
      ...point,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
  
  console.log('Migração concluída!');
}

migrate();