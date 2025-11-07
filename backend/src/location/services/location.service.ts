import { HttpException, HttpStatus, Injectable, Res } from '@nestjs/common';
import { LocationRepository } from '../repository/location.repository';
import * as Bluebird from 'bluebird';

import axios, { HttpStatusCode } from 'axios';
import { CreateLocationDto } from '../Dto/createLocation.dto';
import { CourtService } from 'src/court/services/court.service';
import { Types } from 'mongoose';
import { ShiftService } from 'src/shift/services/shift.service';
import dayjs from 'dayjs';
import { LocationEntity } from '../entities/location.entity';
// import { Location } from './../../../../fontend/src/interface';

require('dotenv').config();

@Injectable()
export class LocationService {
    constructor(
        private readonly locationRepository: LocationRepository,
        private readonly courtService: CourtService,
        private readonly shiftService: ShiftService,
    ) {}

    getHoursFormat(date: Date) {
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const formattedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
        return formattedTime;
    }

    getPeriod(startTimeShift: Date, morningEnd: Date, afternoonEnd: Date) {
        let period;
        if (startTimeShift.getTime() < morningEnd.getTime()) {
            period = 'Ca sáng';
        } else if (startTimeShift.getTime() < afternoonEnd.getTime()) {
            period = 'Ca chiều';
        } else {
            period = 'Ca tối';
        }
        return period;
    }

    createShifts = async (
        startTime: string,
        endTime: string,
        location: LocationEntity,
        priceMin: number,
        priceMax: number,
    ) => {
        const msPerHour = 60 * 60 * 1000;
        const openStartTime = new Date(`1970-01-02T${startTime}:00`);
        const openEndTime = new Date(`1970-01-02T${endTime}:00`);
        const morningEnd = new Date(`1970-01-02T12:00:00`);
        const afternoonEnd = new Date(`1970-01-02T17:00:00`);

        const totalHours =
            (openEndTime.getTime() - openStartTime.getTime()) / msPerHour;

        const totalShifts = totalHours / 2;

        for (let i = 0; i < totalShifts; i++) {
            const shiftDuration = 2 * msPerHour;
            const startTimeShift = new Date(
                openStartTime.getTime() + i * shiftDuration,
            );
            const endTimeShift = new Date(
                startTimeShift.getTime() + shiftDuration,
            );

            let period = this.getPeriod(
                startTimeShift,
                morningEnd,
                afternoonEnd,
            );

            let price;
            if (period === 'Ca tối') {
                price = priceMax;
            } else {
                price = priceMin;
            }

            const shiftData = {
                shiftNumber: i + 1,
                startTime: this.getHoursFormat(startTimeShift),
                endTime: this.getHoursFormat(endTimeShift),
                price,
                period,
                location,
            };

            try {
                await this.shiftService.createShift(shiftData);
            } catch (error) {
                console.error('Error creating shift:', error);
            }
        }
    };

    async createLocation(createLocationDto: CreateLocationDto) {
        try {
            const existingLocation =
                await this.locationRepository.createLocation(createLocationDto);

            await this.createShifts(
                existingLocation.openHours.start,
                existingLocation.openHours.end,
                existingLocation,
                existingLocation.priceMin,
                existingLocation.priceMax,
            );

            await this.courtService.createCourts(
                existingLocation,
                createLocationDto.numberOfCourts,
            );

            return {
                statusCode: HttpStatus.OK,
                message: 'Create location success',
                data: { existingLocation },
            };
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }

    async getLocationById(id: number) {
        try {
            const location = await this.locationRepository.findById(id);

            return {
                statusCode: HttpStatus.OK,
                message: 'success',
                data: {
                    location,
                },
            };
        } catch (err) {
            throw new HttpException(
                'location is not exists',
                HttpStatus.NOT_FOUND,
            );
        }
    }

    async getAllLocations() {
        const locations = await this.locationRepository.findAllLocations();
        return {
            statusCode: HttpStatusCode.Ok,
            message: 'success',
            data: {
                locations,
            },
        };
    }

    async findNearbyLocations(
        latitude: number,
        longitude: number,
        radius: number,
    ) {
        const locations = await this.locationRepository.findAllLocations();
        const locationsWithinRadius = this.getLocationsWithinRadius(
            latitude,
            longitude,
            radius,
            locations,
        );

        const result = await Bluebird.map(
            locationsWithinRadius,
            async (location) => {
                const distance = await this.realDistanceBetween2Points(
                    latitude,
                    longitude,
                    location.latitude,
                    location.longitude,
                );
                return { location, distance };
            },
            { concurrency: 4 },
        );

        return result;
    }

    async getLocationOptions() {
        try {
            const locations = await this.locationRepository.findAllLocations();

            const options = locations.map((location) => ({
                value: location.id,
                label: `${location.name} (${location.address})`,
            }));

            return {
                statusCode: HttpStatus.OK,
                message: 'success',
                data: options,
            };
        } catch (error) {
            throw new HttpException(
                {
                    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                    message: 'Failed to fetch location options',
                    error: error.message,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async countLocationsByCity(city: string) {
        try {
            const count =
                await this.locationRepository.countLocationsByCity(city);
            return {
                statusCode: HttpStatus.OK,
                message: 'success',
                data: {
                    count,
                },
            };
        } catch (err) {
            throw new HttpException(
                {
                    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                    message: 'Failed to get location count',
                    error: err.message,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
    async findByCity(
        city: string,
        pageNumber: number,
        latitude: number,
        longitude: number,
    ) {
        const locations = await this.locationRepository.findByCity(
            city,
            pageNumber,
        );

        //fake data
        // const distance = { text: '9.86 km', value: '9860' };
        // return {
        //     statusCode: HttpStatus.OK,
        //     message: 'success',
        //     data: locations.map((locations) => {
        //         return { ...locations, distance };
        //     }),
        // };

        const locationsWithDistance = await Bluebird.map(
            locations,
            async (location) => {
                const distance = await this.realDistanceBetween2Points(
                    latitude,
                    longitude,
                    location.latitude,
                    location.longitude,
                );
                return { ...location, distance };
            },
        );
        return locationsWithDistance;
    }

    async updateLocation(
        locationId: number,
        updateLocationDto: CreateLocationDto,
    ) {
        try {
            const existingLocation =
                await this.locationRepository.findById(locationId);
            if (!existingLocation) {
                throw new HttpException(
                    'Location not found',
                    HttpStatus.NOT_FOUND,
                );
            }
            await this.locationRepository.update(locationId, updateLocationDto);
            return {
                message: 'Location update successfully',
            };
        } catch (error) {
            throw new HttpException(
                error.message,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async deleteLocation(locationId: number) {
        try {
            const location = await this.locationRepository.findById(locationId);
            if (!location) {
                throw new HttpException(
                    'Location not found',
                    HttpStatus.NOT_FOUND,
                );
            }
            await this.locationRepository.delete(locationId);
            return {
                message: 'Location deleted successfully',
            };
        } catch (error) {
            throw new HttpException(
                error.message,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    private toRadians(degrees: number): number {
        return degrees * (Math.PI / 180);
    }

    private distanceBetween2Points(la1, lo1, la2, lo2) {
        const R = 6371;
        const dLat = this.toRadians(la2 - la1);
        const dLon = this.toRadians(lo2 - lo1);
        const la1ToRad = this.toRadians(la1);
        const la2ToRad = this.toRadians(la2);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(la1ToRad) *
                Math.cos(la2ToRad) *
                Math.sin(dLon / 2) *
                Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const d = R * c;
        return d;
    }

    async realDistanceBetween2Points(la1, lo1, la2, lo2) {
        // console.log(la1, lo1, lo2, la2);
        const origin = `${la1},${lo1}`;
        const destination = `${la2},${lo2}`;
        const vehicle = 'car';
        const apiKey = process.env.API_KEY_GOONG_MAP;

        const url = `https://rsapi.goong.io/Direction?origin=${origin}&destination=${destination}&vehicle=${vehicle}&api_key=${apiKey}`;

        const response = await axios.get(url);

        const result = response.data.routes[0].legs[0].distance;
        return result;
    }
    private getLocationsWithinRadius(latitude, longitude, radius, locations) {
        const result = [];
        for (const location of locations) {
            const distance = this.distanceBetween2Points(
                latitude,
                longitude,
                location.latitude,
                location.longitude,
            );
            if (distance + 1 <= radius) {
                result.push(location);
                break;
            }
        }
        return result;
    }
}
