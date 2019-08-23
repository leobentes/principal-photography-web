import { Pipe, PipeTransform } from '@angular/core';

export class City {
  constructor(
    public country: string,
    public region: string,
    public cityCode: string,
    public cityName: string
  ) {}
}

export function getAllCities(language: string): City[] {

  const CITIES_LANG = [
    { country: 'BR', region: 'DF', cityCode: 'BSB', 'en-US': 'Brasilia', pt: 'Brasília' },
    { country: 'BR', region: 'SP', cityCode: 'SPO', 'en-US': 'Sao Paulo', pt: 'São Paulo' },
    { country: 'BR', region: 'RJ', cityCode: 'RJO', 'en-US': 'Rio de Janeiro', pt: 'Rio de Janeiro' },
    { country: 'US', region: 'CA', cityCode: 'LAX', 'en-US': 'Los Angeles', pt: 'Los Angeles' },
    { country: 'US', region: 'NY', cityCode: 'NYC', 'en-US': 'New York', pt: 'Nova York' },
    { country: 'US', region: 'GA', cityCode: 'ATL', 'en-US': 'Atlanta', pt: 'Atlanta' },
    { country: 'US', region: 'NV', cityCode: 'SAN', 'en-US': 'San Diego', pt: 'San Diego' }
  ];

  const ALLCITIES: City[] = [];

  language = (null) ? 'en-US' : language;

  for (let i = 0, cityItem=''; i < CITIES_LANG.length; i++){
    let cityItem: City = new City (CITIES_LANG[i].country, CITIES_LANG[i].region, CITIES_LANG[i].cityCode, CITIES_LANG[i][language]);
    ALLCITIES.push(cityItem);
  }
  
  return ALLCITIES;
}

export function getCity(cityCode: string, language: string): string {

  var cityName = '';
  const ALLCITIES: City[] = getAllCities (language);

  for (let i = 0; i < ALLCITIES.length; i++){
    if (cityCode === ALLCITIES[i].cityCode) {
      cityName = ALLCITIES[i].cityName;
      break;
    }
  }
  return cityName;
}


@Pipe({name: 'getCityName'})
export class getCityNamePipe implements PipeTransform {
  transform(cityCode: string, language: string): string {
    return getCity(cityCode, language);
  }
}

