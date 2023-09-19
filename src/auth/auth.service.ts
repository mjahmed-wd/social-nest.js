import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';

import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { SignUpConfirmationDto, SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { IToken } from './interfaces/auth.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async signUp(signUpDto: SignUpDto): Promise<User> {
    const { name, email, password } = signUpDto;

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      const user = await this.userModel.create({
        name,
        email,
        password: hashedPassword,
      });

      return user;
    } catch (error) {
      if (error?.code === 11000) {
        throw new ConflictException('Duplicate Email Entered');
      }
    }
  }

  async signUpConfirmation(
    signUpConfirmationDto: SignUpConfirmationDto,
  ): Promise<IToken> {
    const { id, otp } = signUpConfirmationDto;

    try {
      const user = await this.userModel.findById(id);

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      if (user.isVerified)
        throw new UnauthorizedException('User already verified');
      else if (user.otp !== otp) {
        throw new UnauthorizedException('Invalid OTP');
      } else {
        user.isVerified = true;
        await user.save();
      }

      const token = this.jwtService.sign({
        id: user._id,
        name: user.name,
        email: user.email,
      });

      return { token };
    } catch (error) {
      throw error;
    }
  }

  async login(loginDto: LoginDto): Promise<IToken> {
    const { email, password } = loginDto;

    const user = await this.userModel.findOne({ email });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    } else if (!user.isVerified) {
      throw new UnauthorizedException('Please verify your email');
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if (!isPasswordMatched) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const token = this.jwtService.sign({
      id: user._id,
      name: user.name,
      email: user.email,
    });

    return { token };
  }
}
