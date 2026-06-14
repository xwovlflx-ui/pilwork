import { Body, Controller, Get, Post, Req, Res, UseGuards } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import type { Request, Response } from "express";
import { AuthService } from "./auth.service.js";
import { CurrentUser } from "./current-user.decorator.js";
import { ForgotPasswordDto } from "./dto/forgot-password.dto.js";
import { LoginDto } from "./dto/login.dto.js";
import { RegisterDto } from "./dto/register.dto.js";
import { JwtAuthGuard } from "./jwt-auth.guard.js";
import type { RequestUser } from "./auth.types.js";

const REFRESH_COOKIE = "fillwork_refresh";

@Controller("auth")
export class AuthController {
  constructor(
    private readonly auth: AuthService,
    private readonly config: ConfigService,
  ) {}

  @Post("login")
  async login(@Body() input: LoginDto, @Req() request: Request, @Res({ passthrough: true }) response: Response) {
    const session = await this.auth.login(input, requestMeta(request));
    this.setRefreshCookie(response, session.refreshToken);
    return { token: session.token, user: session.user };
  }

  @Post("register")
  async register(@Body() input: RegisterDto, @Req() request: Request, @Res({ passthrough: true }) response: Response) {
    const session = await this.auth.register(input, requestMeta(request));
    this.setRefreshCookie(response, session.refreshToken);
    return { token: session.token, user: session.user };
  }

  @Post("refresh")
  async refresh(@Req() request: Request, @Res({ passthrough: true }) response: Response) {
    const token = request.cookies?.[REFRESH_COOKIE] as string | undefined;
    const session = await this.auth.refresh(token, requestMeta(request));
    this.setRefreshCookie(response, session.refreshToken);
    return { token: session.token, user: session.user };
  }

  @Post("logout")
  async logout(@Req() request: Request, @Res({ passthrough: true }) response: Response) {
    await this.auth.logout(request.cookies?.[REFRESH_COOKIE] as string | undefined);
    response.clearCookie(REFRESH_COOKIE, this.cookieOptions());
    return { success: true };
  }

  @Post("forgot-password")
  forgotPassword(@Body() _input: ForgotPasswordDto) {
    return { message: "가입된 계정이라면 비밀번호 재설정 안내를 발송했습니다." };
  }

  @UseGuards(JwtAuthGuard)
  @Get("me")
  getMe(@CurrentUser() actor: RequestUser) {
    return this.auth.getMe(actor);
  }

  private setRefreshCookie(response: Response, token: string) {
    const days = Number(this.config.get<string>("REFRESH_TOKEN_DAYS", "30"));
    response.cookie(REFRESH_COOKIE, token, { ...this.cookieOptions(), maxAge: days * 86_400_000 });
  }

  private cookieOptions() {
    return {
      httpOnly: true,
      secure: this.config.get<string>("COOKIE_SECURE", "false") === "true",
      sameSite: "lax" as const,
      path: "/api/auth",
    };
  }
}

function requestMeta(request: Request) {
  return { ipAddress: request.ip, userAgent: request.get("user-agent") };
}

