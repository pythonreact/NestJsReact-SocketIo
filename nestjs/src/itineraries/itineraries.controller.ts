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
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { BulkDeleteItinerariesDto } from './dtos/bulk-delete-itineraries.dto';
import { BulkCreateItinerariesDto } from './dtos/bulk-create-itineraries.dto';

@Injectable()
@ApiTags('Itineraries')
@Controller('itineraries')
export class ItinerariesController {
  constructor(private itinerariesService: ItinerariesService) {}

  // create bulk itinerary
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Bulk Create Itineraries', description: 'Bulk Create Itineraries' })
  @ApiBody({
    type: BulkCreateItinerariesDto,
    description: 'JSON => number: number of bulk created Itineraries',
  })
  @ApiResponse({ status: 201, description: 'Itineraries have been successfully created' })
  @Post('/bulkcreate')
  async itineraryBulkCreate(
    @Body() body: BulkCreateItinerariesDto,
    @CurrentUser('email') email: string,
  ) {
    return await this.itinerariesService.createBulkItinerary(body.number, email);
  }

  // delete bulk itinerary
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Bulk Delete Itineraries', description: 'Bulk Delete Itineraries' })
  @ApiBody({
    type: BulkDeleteItinerariesDto,
    description: 'JSON => data: ids of bulk deleted Itineraries',
  })
  @ApiResponse({ status: 200, description: 'Itineraries have been successfully deleted' })
  @Delete('/bulkdelete')
  async itineraryBulkDelete(@Body() body: BulkDeleteItinerariesDto) {
    return await this.itinerariesService.deleteBulkItinerary(body.data);
  }

  // list itinerary detail
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get Itinerary by Id', description: 'Get Itinerary by Id' })
  @ApiParam({ name: 'id', type: 'string', description: 'Id of Itinerary' })
  @ApiResponse({ status: 200, description: 'Itinerary has been successfully listed' })
  @Get('/:id')
  itineraryDetailView(@Param('id') id: string) {
    return this.itinerariesService.getItineraryId(id);
  }

  // update itinerary
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update Itinerary by Id', description: 'Update Itinerary by Id' })
  @ApiParam({ name: 'id', type: 'string', description: 'Id of Itinerary' })
  @ApiBody({ type: UpdateItineraryDto, description: 'Json structure for update itinerary' })
  @ApiResponse({ status: 200, description: 'Itinerary has been successfully updated' })
  @Patch('/:id')
  itineraryUpdateView(@Param('id') id: string, @Body() body: UpdateItineraryDto) {
    return this.itinerariesService.updateItinerary(id, body);
  }

  // delete itinerary
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete Itinerary by Id', description: 'Delete Itinerary by Id' })
  @ApiParam({ name: 'id', type: 'string', description: 'Id of Itinerary' })
  @ApiResponse({ status: 200, description: 'Itinerary has been successfully deleted' })
  @Delete('/:id')
  itineraryDeleteView(@Param('id') id: string) {
    return this.itinerariesService.deleteItinerary(id);
  }

  // create itinerary
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create Itinerary', description: 'Create Itinerary' })
  @ApiBody({ type: CreateItineraryDto, description: 'Json structure for create itinerary' })
  @ApiResponse({ status: 201, description: 'Itinerary has been successfully created' })
  @Serialize(ItineraryDto)
  @Post()
  itineraryCreateView(@Body() body: CreateItineraryDto, @Request() req: any) {
    return this.itinerariesService.createItinerary(body, req.email);
  }

  // list all itineraries
  @ApiOperation({ summary: 'Get All Itineraries', description: 'Get All Itineraries' })
  @ApiResponse({ status: 200, description: 'Itineraries have been successfully listed' })
  @Notoken()
  @Get()
  itineraryListView() {
    return this.itinerariesService.getItinerariesAll();
  }
}
