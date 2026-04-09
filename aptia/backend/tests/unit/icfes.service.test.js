jest.mock('../../src/modules/icfes/IcfesScore.model');
const IcfesScore  = require('../../src/modules/icfes/IcfesScore.model');
const icfesService = require('../../src/modules/icfes/icfes.service');

describe('ICFES Service - Unit Tests', () => {

  afterEach(() => jest.clearAllMocks());

  it('debe guardar puntajes válidos', async () => {
    const mockScore = {
      userId: 'user1', scoreMath: 200, scoreReading: 180,
      scoreSciences: 190, scoreSocial: 170, scoreEnglish: 160, scoreGlobal: 400
    };
    IcfesScore.findOneAndUpdate.mockResolvedValue(mockScore);
    const result = await icfesService.saveScore('user1', mockScore);
    expect(result.scoreGlobal).toBe(400);
    expect(IcfesScore.findOneAndUpdate).toHaveBeenCalledTimes(1);
  });

  it('debe confirmar puntajes pendientes', async () => {
    IcfesScore.findOneAndUpdate.mockResolvedValue({ confirmed: true });
    const result = await icfesService.confirmScore('user1');
    expect(result.confirmed).toBe(true);
  });

  it('debe lanzar error si no hay puntaje para confirmar', async () => {
    IcfesScore.findOneAndUpdate.mockResolvedValue(null);
    await expect(icfesService.confirmScore('user1'))
      .rejects.toThrow('No hay puntaje pendiente de confirmar');
  });
});