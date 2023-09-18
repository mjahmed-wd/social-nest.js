import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { SignUpConfirmationDto, SignUpDto } from './dto/signup.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  signUp(@Body() signUpDto: SignUpDto): Promise<{ token: string }> {
    return this.authService.signUp(signUpDto);
  }

  // @UseGuards(AuthService)
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
}
