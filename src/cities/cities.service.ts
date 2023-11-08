import { TypeOrmQueryService } from '@nestjs-query/query-typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { City } from './entities/city.entity';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class CitiesService extends TypeOrmQueryService<City> {
  constructor(
    @InjectRepository(City) repo: Repository<City>,
    private readonly httpService: HttpService,
  ) {
    // pass the use soft delete option to the service.
    super(repo, { useSoftDelete: true });
  }

  async findCities() {
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

    const alertedAreas = alerts.map(({ data }) => data);

    return this.repo.find({
      where: { name: In(alertedAreas) },
    });
  }
}
