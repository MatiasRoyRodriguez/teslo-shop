import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { GetUser } from './decorators/get-user.decorator';
import { CreateUserDto, LoginUserDto } from './dto';
import { User } from './entities/user.entity';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) { }

	@Post('register')
	create(@Body() createUserDto: CreateUserDto) {
		return this.authService.create(createUserDto);
	}

	@Post('login')
	loginUser(@Body() loginUserDto: LoginUserDto) {
		return this.authService.login(loginUserDto);
	}

	@Get('private')
	@UseGuards(AuthGuard())
	TestingPrivateRoute(
		@GetUser() user: User
	) {
		// const user = 

		return {
			ok: true,
			message: 'Hello private',
			user
		}
	}

}
