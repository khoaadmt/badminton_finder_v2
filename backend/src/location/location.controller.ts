import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    Query,
} from '@nestjs/common';
import { LocationService } from './services/location.service';
import { query } from 'express';
import { CreateLocationDto } from './Dto/createLocation.dto';

@Controller('locations')
export class LocationController {
    constructor(private readonly locationService: LocationService) {}

    @Get('/count-by-city')
    countLocationsByCity(@Query('city') city) {
        return this.locationService.countLocationsByCity(city);
    }

    @Get('/key-label')
    getLocationOptions() {
        return this.locationService.getLocationOptions();
    }

    @Get('/city')
    getLocationByCity(
        @Query('city') city: string,
        @Query('page') pageNumber: number,
        @Query('latitude') latitude: number,
        @Query('longitude') longitude: number,
    ) {
        return this.locationService.findByCity(
            city,
            pageNumber,
            latitude,
            longitude,
        );
    }

    @Get(':id')
    getLocationById(@Param('id') id: number) {
        return this.locationService.getLocationById(id);
    }

    @Get('/nearby')
    async getNearbyLocations(
        @Query('radius') radius: number,
        @Query('latitude') latitude: number,
        @Query('longitude') longitude: number,
    ) {
        return await this.locationService.findNearbyLocations(
            latitude,
            longitude,
            radius,
        );
    }

    @Get('')
    getAllLocations() {
        return this.locationService.getAllLocations();
    }

    @Post('')
    async createLocation(@Body() createLocationDto: CreateLocationDto) {
        return await this.locationService.createLocation(createLocationDto);
    }

    @Put(':locationId')
    updateLocation(
        @Param('locationId') locationId: number,
        @Body() locationUpdateDto: CreateLocationDto,
    ) {
        return this.locationService.updateLocation(
            locationId,
            locationUpdateDto,
        );
    }

    @Delete(':locationId')
    deleteLocation(@Param('locationId') locationId: number) {
        console.log(locationId);
        return this.locationService.deleteLocation(locationId);
    }
}
