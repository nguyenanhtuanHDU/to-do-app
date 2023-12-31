import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './auth/login/login.component';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ToastModule } from 'primeng/toast';
import { AuthComponent } from './auth/auth.component';
import { SignUpComponent } from './auth/sign-up/sign-up.component';
import { RadioButtonModule } from 'primeng/radiobutton';
import { CookieService } from 'ngx-cookie-service';
import { AutoFocusModule } from 'primeng/autofocus';
import { DialogModule } from 'primeng/dialog';
import { StepsModule } from 'primeng/steps';
import { InputNumberModule } from 'primeng/inputnumber';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ProgressBarModule } from 'primeng/progressbar';
import { BlockUIModule } from 'primeng/blockui';
import { ResponseInterceptor } from './shared/response-interceptor';
import { HomeComponent } from './home/home.component';
import { MenuComponent } from './menu/menu.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SidebarModule } from 'primeng/sidebar';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { SwiperModule } from 'swiper/angular';
import { NgChartsModule } from 'ng2-charts';
import { SpeedDialModule } from 'primeng/speeddial';
import { TasksComponent } from './tasks/tasks.component';
import { SkeletonModule } from 'primeng/skeleton';
import { CheckboxModule } from 'primeng/checkbox';
import { CalendarModule } from 'primeng/calendar';
import { TimeAgo } from './shared/pipes/TimeAgo.pipe';
import { FileUploadModule } from 'primeng/fileupload';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { FileSize } from './shared/pipes/FileSize.pipe';
import { ImgFallbackModule } from 'ngx-img-fallback';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ImageModule } from 'primeng/image';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { GalleriaModule } from 'primeng/galleria';
import { IconComponent } from './shared/icon/icon.component';
import { ColorPickerModule } from 'primeng/colorpicker';
import { ProjectComponent } from './project/project.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    AuthComponent,
    SignUpComponent,
    PageNotFoundComponent,
    HomeComponent,
    MenuComponent,
    TasksComponent,
    TimeAgo,
    FileSize,
    IconComponent,
    ProjectComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    InputTextModule,
    ButtonModule,
    PasswordModule,
    RippleModule,
    ToastModule,
    RadioButtonModule,
    AutoFocusModule,
    DialogModule,
    StepsModule,
    InputNumberModule,
    ProgressBarModule,
    BlockUIModule,
    FontAwesomeModule,
    SidebarModule,
    ConfirmDialogModule,
    SwiperModule,
    NgChartsModule,
    SpeedDialModule,
    SkeletonModule,
    CheckboxModule,
    CalendarModule,
    FileUploadModule,
    NgScrollbarModule,
    ImgFallbackModule,
    ConfirmPopupModule,
    ImageModule,
    OverlayPanelModule,
    GalleriaModule,
    ColorPickerModule,
  ],
  providers: [
    CookieService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ResponseInterceptor,
      multi: true,
    },
    MessageService,
    ConfirmationService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
