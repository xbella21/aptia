jest.mock('../../src/modules/psychometric/PsychometricQuestion.model');
jest.mock('../../src/modules/psychometric/VocationalProfile.model');

const PsychometricQuestion = require('../../src/modules/psychometric/PsychometricQuestion.model');
const VocationalProfile    = require('../../src/modules/psychometric/VocationalProfile.model');
const psychoService        = require('../../src/modules/psychometric/psychometric.service');

describe('Psychometric Service - Unit Tests', () => {

  afterEach(() => jest.clearAllMocks());

  it('debe retornar preguntas activas ordenadas', async () => {
    const mockQuestions = [
      { statement: '¿Te gusta matemáticas?', area: 'logico_matematica', displayOrder: 1 },
      { statement: '¿Te gusta escribir?',    area: 'comunicativa',      displayOrder: 2 },
    ];
    PsychometricQuestion.find.mockReturnValue({
      sort: jest.fn().mockResolvedValue(mockQuestions)
    });
    const result = await psychoService.getActiveQuestions();
    expect(result).toHaveLength(2);
    expect(result[0].area).toBe('logico_matematica');
  });

  it('debe calcular porcentajes correctamente', async () => {
    PsychometricQuestion.find.mockReturnValue({ sort: jest.fn().mockResolvedValue([]) });
    VocationalProfile.findOneAndUpdate.mockResolvedValue({
      percentages: { logico_matematica: 60, cientifica: 40 }
    });
    const answers = [
      { area: 'logico_matematica', value: 3 },
      { area: 'logico_matematica', value: 3 },
      { area: 'cientifica',        value: 2 },
    ];
    const result = await psychoService.processAnswers('user1', answers);
    expect(result.percentages.logico_matematica).toBe(60);
  });
});