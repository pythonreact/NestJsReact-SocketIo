import { UsersService } from './../users/users.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { CreateItineraryDto } from './dtos/create-itinerary.dto';
import { Itinerary } from './itinerary.entity';
import { faker } from '@faker-js/faker';

@Injectable()
export class ItinerariesService {
  constructor(
    @InjectRepository(Itinerary) private repo: Repository<Itinerary>,
    private usersService: UsersService,
    private dataSource: DataSource,
  ) {}

  async createItinerary(itineraryDto: CreateItineraryDto, email: string) {
    const [user] = await this.usersService.find(email);
    const itinerary = this.repo.create(itineraryDto);
    itinerary.user = user;
    return this.repo.save(itinerary);
  }

  async getItineraryId(id: string) {
    const init = await this.repo.createQueryBuilder().select('*').getRawMany();
    if (init.length === 0) {
      throw new NotFoundException('Itineraries not found');
    }

    const itinerary = await this.repo
      .createQueryBuilder('itinerary')
      .leftJoinAndSelect('itinerary.user', 'user')
      .where('itinerary.id = :x', { x: id })
      .select([
        'itinerary.id AS id',
        'itinerary.name AS name',
        'itinerary.departure AS departure',
        'itinerary.stops AS stops',
        'itinerary.arrival AS arrival',
        'itinerary.userId AS userId',
        'user.email AS userEmail',
        'user.admin AS userAdmin',
      ])
      .getRawOne();
    if (itinerary.Length === 0) {
      throw new NotFoundException('Itinerary not found');
    }

    return itinerary;
  }

  async getItinerariesAll() {
    const itinerary = await this.repo.createQueryBuilder().select('*').getRawMany();
    return itinerary;
  }

  async updateItinerary(id: string, attrs: Partial<Itinerary>) {
    const itinerary = await this.repo.findOneBy({ id });
    if (!itinerary) {
      throw new NotFoundException('Itinerary not found');
    }
    Object.assign(itinerary, attrs);
    return this.repo.save(itinerary);
  }

  async deleteItinerary(id: string) {
    if (!id) {
      return null;
    }
    const itinerary = await this.repo.findOneBy({ id });
    if (!itinerary) {
      throw new NotFoundException('Itinerary not found');
    }
    return this.repo.remove(itinerary);
  }

  async deleteBulkItinerary(deleteIds: string) {
    const maximumIds = 10000;
    if (!deleteIds.length) return null;

    let n = 1;
    let deletedIdsLength = 0;
    do {
      const ids = Object.values(
        Object.fromEntries(
          Object.entries(JSON.parse(deleteIds)).slice(maximumIds * (n - 1), maximumIds * n),
        ),
      ).map((value) => value);

      deletedIdsLength = ids.length;

      if (ids.length) {
        for (let i = 0; i < ids.length; i++) {
          const id = ids[i] as string;
          try {
            const itinerary = await this.repo.findOneBy({ id });
          } catch (error) {
            throw new NotFoundException('Error Id not found');
          }
        }
        const itinerary = await this.repo
          .createQueryBuilder()
          .delete()
          .from(Itinerary)
          .where('id IN (:...ids)', { ids: ids })
          .execute();
        n++;
      }
    } while (deletedIdsLength > 0);
  }

  async createBulkItinerary(number: any, email: string) {
    const [user] = await this.usersService.find(email);
    const features: Itinerary[] = [];

    for (let i = 0; i <= number; i++) {
      const data = new Itinerary();
      data.name = faker.person.firstName();
      data.departure = faker.location.city();
      data.arrival = faker.location.city();
      data.stops = faker.location.state();
      data.user = user;
      features.push(this.repo.create(data));
      if (i === number - 1) {
        await this.dataSource.manager.save(features);
      }
    }
    const response = await this.repo.createQueryBuilder().select('*').getRawMany();
    return response;
  }
}
