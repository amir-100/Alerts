import { Controller, Get } from '@nestjs/common';
import { CitiesService } from './cities.service';

@Controller()
export class CitiesController {
  constructor(private readonly citiesService: CitiesService) {}

  @Get('cities')
  findCities() {
    return this.citiesService.findCities();
  }

  @Get('alerts')
  findAlerts() {
    return this.citiesService.findAlerts();
  }
}
