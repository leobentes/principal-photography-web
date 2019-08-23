export class CrewPosition {
  constructor(
    public code: string,
    public description: string,
    public quantity: number,
    public days: number,
    public rate: number
  ) {}
}

export const ALLPOSITIONS: CrewPosition[] = [
  { code: 'DIR', description: 'Director', quantity: 1, days: 1, rate: 0 },
  { code: '1STAD', description: '1st Assistant Director', quantity: 1, days: 1, rate: 0 },
  { code: '2NDAD', description: '2nd Assistant Director', quantity: 1, days: 1, rate: 0 },
  { code: 'SCRPT', description: 'Script Supervisor', quantity: 1, days: 1, rate: 0 },
  { code: 'PA', description: 'Production Assistant', quantity: 1, days: 1, rate: 0 },
  { code: 'DP', description: 'Director of Photography', quantity: 1, days: 1, rate: 0 },
  { code: 'CAMOP', description: 'Camera Operator', quantity: 1, days: 1, rate: 0 },
  { code: '1STAC', description: '1st Assistant Camera', quantity: 1, days: 1, rate: 0 },
  { code: '2NDAC', description: '2nd Assistant Camera', quantity: 1, days: 1, rate: 0 },
  { code: 'DIT', description: 'Digital Imaging Technician', quantity: 1, days: 1, rate: 0 },
  { code: 'STCAM', description: 'Steadicam Operator', quantity: 1, days: 1, rate: 0 },
  { code: 'FOCUS', description: 'Focus Puller', quantity: 1, days: 1, rate: 0 },
  { code: 'GAFFR', description: 'Gaffer', quantity: 1, days: 1, rate: 0 },
  { code: 'ELTRC', description: 'Electric', quantity: 1, days: 1, rate: 0 },
  { code: 'KGRIP', description: 'Key Grip', quantity: 1, days: 1, rate: 0 },
  { code: 'GRIP', description: 'Grip', quantity: 1, days: 1, rate: 0 },
  { code: 'STILL', description: 'Still Photographer', quantity: 1, days: 1, rate: 0 },
  { code: 'SDMIX', description: 'Prod. Sound Mixer', quantity: 1, days: 1, rate: 0 },
  { code: 'BOOM', description: 'Boom Operator', quantity: 1, days: 1, rate: 0 },
  { code: 'PRDES', description: 'Production Designer', quantity: 1, days: 1, rate: 0 },
  { code: 'ARTDR', description: 'Art Director', quantity: 1, days: 1, rate: 0 },
  { code: 'SETDS', description: 'Set Designer', quantity: 1, days: 1, rate: 0 },
  { code: 'DECOR', description: 'Set Decorator', quantity: 1, days: 1, rate: 0 },
  { code: 'COSTM', description: 'Costume Designer', quantity: 1, days: 1, rate: 0 },
  { code: 'MAKUP', description: 'Make-up Artist', quantity: 1, days: 1, rate: 0 },
  { code: 'HAIR', description: 'Hair Stylist', quantity: 1, days: 1, rate: 0 },
  { code: 'EFXSP', description: 'Special EFX Supervisor', quantity: 1, days: 1, rate: 0 },
  { code: 'EFXAS', description: 'Special EFX Assistant', quantity: 1, days: 1, rate: 0 },
  { code: 'STUNT', description: 'Stunt Coordinator', quantity: 1, days: 1, rate: 0 },
  { code: 'OTHER', description: 'Other', quantity: 1, days: 1, rate: 0 }
];

export function getPosition(code: string){
  var description = '';
  for (let i = 0; i < ALLPOSITIONS.length; i++){
    if (code === ALLPOSITIONS[i].code) {
      description = ALLPOSITIONS[i].description;
      break;
    }
  }
  return description;
}
