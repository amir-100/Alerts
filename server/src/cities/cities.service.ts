import { TypeOrmQueryService } from '@nestjs-query/query-typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { City } from './entities/city.entity';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import { HttpService } from '@nestjs/axios';

type Alert = {
  alertDate: string;
  title: string;
  data: string;
  category: number;
};

const filterAlertsByLastXMinutes = (alerts: Alert[], minutes: number) => {
  const currentTime = new Date();
  const startTime = new Date(currentTime.getTime() - minutes * 60000);
  const filteredAlerts = alerts.filter((alert) => {
    const alertDate = new Date(alert.alertDate);

    return alertDate >= startTime && alertDate <= currentTime;
  });

  return filteredAlerts;
};

@Injectable()
export class CitiesService extends TypeOrmQueryService<City> {
  constructor(
    @InjectRepository(City) repo: Repository<City>,
    private readonly httpService: HttpService,
  ) {
    // pass the use soft delete option to the service.
    super(repo, { useSoftDelete: true });
  }

  findCities() {
    return this.repo.find();
  }

  async findAlerts() {
    const { data: alerts } = await firstValueFrom(
      this.httpService
        .get(
          'https://www.oref.org.il/WarningMessages/History/AlertsHistory.json',
        )
        .pipe(
          catchError((error: AxiosError) => {
            console.error(error.response.data);
            throw error;
          }),
        ),
    );

    const filteredAlerts = filterAlertsByLastXMinutes(alerts, 5);
    const alertedAreas = filteredAlerts.map(({ data }) => data);

    return this.repo.find({
      where: { name: In(alertedAreas) },
    });
  }
}
