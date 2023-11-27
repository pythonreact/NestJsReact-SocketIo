import {
  Body,
  Controller,
  Delete,
  Get,
  Injectable,
  Param,
  Patch,
  Post,
  Request,
} from '@nestjs/common';
import { CreateItineraryDto } from './dtos/create-itinerary.dto';
import { Serialize } from 'src/common/interceptors/serialize.interceptor';
import { ItineraryDto } from './dtos/itinerary.dto';
import { ItinerariesService } from './itineraries.service';
import { UpdateItineraryDto } from './dtos/update-itinerary.dto';
import { Notoken } from '../common/decorators/no-jwt.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Injectable()
@Controller('itineraries')
export class ItinerariesController {
  constructor(private itinerariesService: ItinerariesService) {}

  // create bulk itinerary
  @Post('/bulkcreate')
  async itineraryBulkCreate(@Body() body: string, @CurrentUser('email') email: string) {
    return await this.itinerariesService.createBulkItinerary(body, email);
  }

  // delete bulk itinerary
  @Delete('/bulkdelete')
  async itineraryBulkDelete(@Body() body: any, @Request() req) {
    return await this.itinerariesService.deleteBulkItinerary(body.data);
  }

  // list itinerary detail
  @Get('/:id')
  itineraryDetailView(@Param('id') id: string) {
    return this.itinerariesService.getItineraryId(id);
  }

  // update itinerary
  @Patch('/:id')
  itineraryUpdateView(@Param('id') id: string, @Body() body: UpdateItineraryDto) {
    return this.itinerariesService.updateItinerary(id, body);
  }

  // delete itinerary
  @Delete('/:id')
  itineraryDeleteView(@Param('id') id: string) {
    return this.itinerariesService.deleteItinerary(id);
  }

  // create itinerary
  @Serialize(ItineraryDto)
  @Post()
  itineraryCreateView(@Body() body: CreateItineraryDto, @Request() req: any) {
    return this.itinerariesService.createItinerary(body, req.email);
  }

  // list all itineraries
  @Notoken()
  @Get()
  itineraryListView() {
    return this.itinerariesService.getItinerariesAll();
  }
}
