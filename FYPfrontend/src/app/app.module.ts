import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HomeComponent } from './pages/home/home.component';
import { HomepageComponent } from './pages/home/homepage/homepage.component';
import { MyProblemSetComponent } from './pages/home/my-problem-set/my-problem-set.component';
import { SubscribeComponent } from './pages/home/subscribe/subscribe.component';
import { NotfoundComponent } from './pages/notfound/notfound.component';
import { ProblemSetCardComponent } from './components/problem-set-card/problem-set-card.component';
import { ProblemSetPagesComponent } from './pages/home/problem-set-pages/problem-set-pages.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { ActivePageComponent } from './pages/home/active-page/active-page.component';
import { CreateProblemSetComponent } from './pages/home/active-page/create-problem-set/create-problem-set.component';
import { AnswerProblemSetComponent } from './pages/home/active-page/answer-problem-set/answer-problem-set.component';
import { InterceptorService } from './@interceptor/interceptor.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AnswerResultComponent } from './pages/home/active-page/answer-result/answer-result.component';
import { ProblemSetIntrodutionComponent } from './pages/home/problem-set-introdution/problem-set-introdution.component';
import { CreateAccountComponent } from './pages/create-account/create-account.component';
import { AccountComponent } from './pages/profile/account/account.component';
import { ProblemSetHistoryComponent } from './pages/home/problem-set-history/problem-set-history.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    NavbarComponent,
    HomeComponent,
    HomepageComponent,
    MyProblemSetComponent,
    SubscribeComponent,
    NotfoundComponent,
    ProblemSetCardComponent,
    ProblemSetPagesComponent,
    ProfileComponent,
    ActivePageComponent,
    CreateProblemSetComponent,
    AnswerProblemSetComponent,
    AnswerResultComponent,
    ProblemSetIntrodutionComponent,
    CreateAccountComponent,
    AccountComponent,
    ProblemSetHistoryComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    NgbModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptorService,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
