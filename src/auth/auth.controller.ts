import { Controller, Get, Post, Body, UseGuards, Req, Headers, SetMetadata } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { IncomingHttpHeaders } from 'http';
import { AuthService } from './auth.service';
import { GetUser, RawHeaders } from './decorators';
import { RoleProtected } from './decorators/role-protected.decorator';
import { CreateUserDto, LoginUserDto } from './dto';
import { User } from './entities/user.entity';
import { UserRoleGuard } from './guards/user-role.guard';
import { ValidRoles } from './interfaces';

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
		@Req() request: Express.Request,
		@GetUser() user: User,
		@GetUser('email') userEmail: string,
		@RawHeaders() rawHeaders: string[],
		@Headers() headers: IncomingHttpHeaders
	) {

		return {
			ok: true,
			message: 'Hello private',
			user,
			userEmail,
			rawHeaders,
			headers
		}
	}

	// @SetMetadata('roles', ['admin','super-user'])
	@Get('private2')
	@RoleProtected( ValidRoles.superUser, ValidRoles.user )
	@UseGuards(AuthGuard(), UserRoleGuard)
	privateRoute2(
		@GetUser() user: User
	) {

		return {
			ok: true,
			user
		}
	}
}
