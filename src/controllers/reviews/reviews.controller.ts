import {Body, Controller, Delete, Post, Put} from '@nestjs/common';
import {ReviewsService} from '../../services/reviews/reviews.service';

@Controller('review')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post('find')
  findReview(@Body() condition: any) {
    return this.reviewsService.findOneByCondition(condition);
  }

  @Post('create')
  createReview(
    @Body('username') username: string,
    @Body('userPic') userPic: string,
    @Body('text') text: string,
    @Body('rating') rating: number,
    @Body('itemId') itemId: string,
  ) {
    return this.reviewsService.createOne(
      rating,
      userPic,
      text,
      username,
      itemId,
    );
  }

  @Put()
  updateReview(@Body('userId') userId: string, @Body('itemId') itemId: string) {
    console.log('controller', userId, itemId);
    return this.reviewsService.updateOne(userId, itemId);
  }

  @Delete()
  deleteReview(@Body() condition: any) {
    return this.reviewsService.deleteOneByCondition(condition);
  }
}
