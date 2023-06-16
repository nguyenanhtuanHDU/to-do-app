import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';
import { AuthService } from './auth/auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      clientID: '1026046227955-tmja6js7j52ssptura545kbq3akmc4bh.apps.googleusercontent.com', // Thay YOUR_CLIENT_ID bằng Client ID của ứng dụng Google OAuth2
      clientSecret: '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', // Thay YOUR_CLIENT_SECRET bằng Client Secret của ứng dụng Google OAuth2
      callbackURL: 'http://localhost:4200/api/auth/google/redirect', // URL callback sau khi xác thực thành công
      scope: ['profile', 'email'], // Phạm vi yêu cầu truy cập (có thể thay đổi)
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any) {
    // Hàm này được gọi khi xác thực thành công
    // profile chứa thông tin người dùng từ Google
    // Bạn có thể xử lý logic đăng ký ở đây hoặc chuyển nó sang AuthService

    const user = await this.authService.findOrCreate(profile); // Gọi service AuthService để xử lý đăng ký hoặc tìm hoặc tạo người dùng
    return user;
  }
}
