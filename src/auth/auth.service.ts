import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    ) {}

    async register(name: string, email: string, password: string) {
        const user = await this.usersService.create(name, email, password);
        const { password: _, ...result } = user;
        return result;
    }

    async login(email: string, password: string ) {
        const user = await this.usersService.findByEmail(email);
        if (!user) {
            throw new UnauthorizedException('Credenciais inválidas');
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            throw new UnauthorizedException('Credenciais inválidas');
        }

        const payload = { sub: user.id, email: user.email };
        const token = await this.jwtService.signAsync(payload);

        return { access_token: token };
    }
}
