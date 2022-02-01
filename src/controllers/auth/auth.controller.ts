import {
  Post,
  Body,
  Controller,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import {AuthService} from '../../services/auth/auth.service';
import {Veggie} from '../../entities/veggie.entity';
import {VeggieService} from 'src/services/user/veggie.service';
import {AuthGuard} from '@nestjs/passport';

@Controller('veggie')
export class AuthController {
  constructor(
    private readonly veggieService: VeggieService,
    private readonly authService: AuthService,
  ) {}

  @Post('register')
  async register(@Body() user: Veggie) {
    return this.veggieService.createOne(user);
  }

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    const validated = await this.authService.validateUser(email, password);
    if (validated) {
      return validated;
    } else {
      throw new UnauthorizedException('Invalid credentials');
    }
  }
}