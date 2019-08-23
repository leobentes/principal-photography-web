
export class CrewPosition {
  
  constructor(
    public code: string,
    public description: string,
    public quantity: number,
    public days: number,
    public rate: number,
    public bits: number
  ) {}
}


export function getPosition(code: string, language:string){

  let description = '';
  let allPositions = getAllPositions(language);

  for (let i = 0; i < allPositions.length; i++){
    if (code === allPositions[i].code) {
      description = allPositions[i].description;
      break;
    }
  }
  return description;
}

export function getBits(code: string){

  let bits = 0;
  let allPositions = getAllPositions(null);

  for (let i = 0; i < allPositions.length; i++){
    if (code === allPositions[i].code) {
      bits = allPositions[i].bits;
      break;
    }
  }
  return bits;
}

export function getAllPositions(language:string): CrewPosition[] {

  const ALLDESCRIPTIONS = [
    { code: 'DIR', 'en-US': 'Director', pt: 'Diretor', bits: 1 },
    { code: '1STAD', 'en-US': '1st Assistant Director', pt: '1º Assistente de Direção', bits: 2 },
    { code: '2NDAD', 'en-US': '2nd Assistant Director', pt: '2º Assistente de Direção', bits: 4 },
    { code: 'SCRPT', 'en-US': 'Script Supervisor', pt: 'Continuísta', bits: 8 },
    { code: 'PA', 'en-US': 'Production Assistant', pt: 'Assistente de Produção', bits: 16 },
    { code: 'DP', 'en-US': 'Director of Photography', pt: 'Diretor de Fotografia', bits: 32 },
    { code: 'CAMOP', 'en-US': 'Camera Operator', pt: 'Operador de Câmera', bits: 64 },
    { code: '1STAC', 'en-US': '1st Assistant Camera', pt: '1º Assistente de Câmera', bits: 128 },
    { code: '2NDAC', 'en-US': '2nd Assistant Camera', pt: '2º Assistente de Câmera', bits: 256 },
    { code: 'DIT', 'en-US': 'Digital Imaging Technician', pt: 'Técnico de Imagem Digital', bits: 512 },
    { code: 'STCAM', 'en-US': 'Steadicam Operator', pt: 'Operador de Steadicam', bits: 1024 },
    { code: 'FOCUS', 'en-US': 'Focus Puller', pt: 'Foquista', bits: 2048 },
    { code: 'GAFFR', 'en-US': 'Gaffer', pt: 'Eletricista-Chefe', bits: 4096 },
    { code: 'ELTRC', 'en-US': 'Electric', pt: 'Eletricista', bits: 8192 },
    { code: 'KGRIP', 'en-US': 'Key Grip', pt: 'Maquinista-Chefe', bits: 16384 },
    { code: 'GRIP', 'en-US': 'Grip', pt: 'Maquinista', bits: 32768 },
    { code: 'STILL', 'en-US': 'Still Photographer', pt: 'Fotógrafo de Still', bits: 65536 },
    { code: 'SDMIX', 'en-US': 'Prod. Sound Mixer', pt: 'Técnico de Som', bits: 131072 },
    { code: 'BOOM', 'en-US': 'Boom Operator', pt: 'Microfonista', bits: 262144 },
    { code: 'PRDES', 'en-US': 'Production Designer', pt: 'Designer de Produção', bits: 524288 },
    { code: 'ARTDR', 'en-US': 'Art Director', pt: 'Diretor de Arte', bits: 1048576 },
    { code: 'SETDS', 'en-US': 'Set Designer', pt: 'Designer de Set', bits: 2097152 },
    { code: 'DECOR', 'en-US': 'Set Decorator', pt: 'Decorador de Set', bits: 4194304 },
    { code: 'COSTM', 'en-US': 'Costume Designer', pt: 'Figurinista', bits: 8388608 },
    { code: 'MAKUP', 'en-US': 'Make-up Artist', pt: 'Maquiador', bits: 16777216 },
    { code: 'HAIR', 'en-US': 'Hair Stylist', pt: 'Cabeleireiro', bits: 33554432 },
    { code: 'EFXSP', 'en-US': 'Special EFX Supervisor', pt: 'Sup. Efeitos Especiais', bits: 67108864 },
    { code: 'EFXAS', 'en-US': 'Special EFX Assistant', pt: 'Assist. Efeitos Especiais', bits: 134217728 },
    { code: 'STUNT', 'en-US': 'Stunt Coordinator', pt: 'Coordenador de Dublês', bits: 268435456 },
    { code: 'OTHER', 'en-US': 'Other', pt: 'Outros', bits: 536870912 }
  ]

  const ALLPOSITIONS: CrewPosition[] = [];

  language = (null) ? 'en-US' : language;

  for (let i = 0, crewItem=''; i < ALLDESCRIPTIONS.length; i++){
    let crewItem: CrewPosition = new CrewPosition (ALLDESCRIPTIONS[i].code, ALLDESCRIPTIONS[i][language], 1, 1, 0, ALLDESCRIPTIONS[i].bits);
    ALLPOSITIONS.push(crewItem);
  }
  
  return ALLPOSITIONS;
}

export function crewBitsAllPositions (): number {
  return Number.MAX_SAFE_INTEGER;
}
