import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { SignUpConfirmationDto, SignUpDto } from './dto/signup.dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from './schemas/user.schema';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  signUp(@Body() signUpDto: SignUpDto): Promise<User> {
    return this.authService.signUp(signUpDto);
  }

  @Post('/signupConfirmation')
  signUpConfirmation(
    @Body() signUpConfirmationDto: SignUpConfirmationDto,
  ): Promise<{ token: string }> {
    return this.authService.signUpConfirmation(signUpConfirmationDto);
  }

  @Post('/login')
  login(@Body() loginDto: LoginDto): Promise<{ token: string }> {
    return this.authService.login(loginDto);
  }

  @Post('/test')
  @UseGuards(AuthGuard())
  test(@Req() req) {
    return req.user;
  }
}
