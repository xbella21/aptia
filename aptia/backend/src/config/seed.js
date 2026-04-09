require('dotenv').config();
const mongoose = require('mongoose');
const PsychometricQuestion = require('../modules/psychometric/PsychometricQuestion.model');
const AcademicProgram = require('../modules/admin/AcademicProgrma.model');
const questions = [
  { statement: '¿Te gusta resolver problemas matemáticos?', area: 'logico_matematica', displayOrder: 1 },
  { statement: '¿Disfrutas analizar datos y estadísticas?', area: 'logico_matematica', displayOrder: 2 },
  { statement: '¿Te interesa programar o crear algoritmos?', area: 'logico_matematica', displayOrder: 3 },
  { statement: '¿Te gusta realizar experimentos científicos?', area: 'cientifica', displayOrder: 4 },
  { statement: '¿Disfrutas investigar cómo funcionan las cosas?', area: 'cientifica', displayOrder: 5 },
  { statement: '¿Te interesa la biología o la química?', area: 'cientifica', displayOrder: 6 },
  { statement: '¿Te gusta leer y escribir textos?', area: 'comunicativa', displayOrder: 7 },
  { statement: '¿Disfrutas debatir y argumentar ideas?', area: 'comunicativa', displayOrder: 8 },
  { statement: '¿Te interesa aprender idiomas extranjeros?', area: 'comunicativa', displayOrder: 9 },
  { statement: '¿Te gusta liderar grupos o proyectos?', area: 'social_liderazgo', displayOrder: 10 },
  { statement: '¿Disfrutas trabajar en equipo y ayudar a otros?', area: 'social_liderazgo', displayOrder: 11 },
  { statement: '¿Te interesa la psicología o el trabajo social?', area: 'social_liderazgo', displayOrder: 12 },
  { statement: '¿Te gusta dibujar, diseñar o crear arte?', area: 'creativa', displayOrder: 13 },
  { statement: '¿Disfrutas la música o las artes escénicas?', area: 'creativa', displayOrder: 14 },
  { statement: '¿Te interesa la arquitectura o el diseño gráfico?', area: 'creativa', displayOrder: 15 },
  { statement: '¿Te gusta organizar y planificar proyectos?', area: 'administrativa', displayOrder: 16 },
  { statement: '¿Disfrutas gestionar recursos y presupuestos?', area: 'administrativa', displayOrder: 17 },
  { statement: '¿Te interesa el mundo empresarial y los negocios?', area: 'administrativa', displayOrder: 18 },
];

const programs = [
  { name: 'Ingeniería de Sistemas', weights: { math: 40, reading: 20, sciences: 25, social: 5, english: 10 }, relatedVocationalAreas: ['logico_matematica', 'cientifica'], isActive: true },
  { name: 'Medicina', weights: { math: 25, reading: 20, sciences: 40, social: 5, english: 10 }, relatedVocationalAreas: ['cientifica', 'social_liderazgo'], isActive: true },
  { name: 'Derecho', weights: { math: 10, reading: 40, sciences: 5, social: 35, english: 10 }, relatedVocationalAreas: ['comunicativa', 'social_liderazgo'], isActive: true },
  { name: 'Diseño Gráfico', weights: { math: 15, reading: 25, sciences: 10, social: 10, english: 40 }, relatedVocationalAreas: ['creativa', 'comunicativa'], isActive: true },
  { name: 'Administración de Empresas', weights: { math: 25, reading: 25, sciences: 10, social: 25, english: 15 }, relatedVocationalAreas: ['administrativa', 'social_liderazgo'], isActive: true },
  { name: 'Psicología', weights: { math: 10, reading: 35, sciences: 20, social: 25, english: 10 }, relatedVocationalAreas: ['social_liderazgo', 'comunicativa'], isActive: true },
];

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  await PsychometricQuestion.deleteMany({});
  await PsychometricQuestion.insertMany(questions.map(q => ({ ...q, isActive: true })));
  await AcademicProgram.deleteMany({});
  await AcademicProgram.insertMany(programs);
  console.log('✅ Preguntas y programas insertados correctamente');
  await mongoose.disconnect();
}

seed().catch(console.error);