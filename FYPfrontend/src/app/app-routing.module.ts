import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
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
import { problemSetPagesResolver } from './@resolves/problem-set-pages.resolver';
import { answerProblemSetResolver } from './@resolves/answer-problem-set.resolver';
import { AccountComponent } from './pages/profile/account/account.component';
import { AnswerResultComponent } from './pages/home/active-page/answer-result/answer-result.component';
import { ProblemSetIntrodutionComponent } from './pages/home/problem-set-introdution/problem-set-introdution.component';
import { CreateAccountComponent } from './pages/create-account/create-account.component';
import { ProblemSetHistoryComponent } from './pages/home/problem-set-history/problem-set-history.component';
import { authChildGuard } from './@guard/auth-child.guard';
import { authGuard } from './@guard/auth.guard';

const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [authGuard],
    canActivateChild: [authChildGuard],
    children: [
      {
        path: 'homepage',
        component: HomepageComponent
      },
      {
        path: 'myproblemset',
        component: MyProblemSetComponent
      },
      {
        path: 'subscribe',
        component: SubscribeComponent
      },
      {
        path: 'problemsetpages/:guid',
        component: ProblemSetPagesComponent,
        resolve: {
          problemSetItemValue: problemSetPagesResolver
        }
      },
      {
        path: 'problem-set-history/:guid',
        component: ProblemSetHistoryComponent//,
        // resolve: {
        //   problemSetItemValue: problemSetPagesResolver
        // }
      },
      {
        path: 'problem-set-introdution/:guid',
        component: ProblemSetIntrodutionComponent,
        resolve: {
          problemSetItemValue: problemSetPagesResolver
        }
      },
      {
        path: 'active-page',
        component: ActivePageComponent,
        children: [
          {
            path: 'create-problem-set',
            component: CreateProblemSetComponent
          },
          {
            path: 'answer-problem-set',
            component: AnswerProblemSetComponent,
            resolve: { answerProblemSetValue: answerProblemSetResolver },
          },
          {
            path: 'answer-result',
            component: AnswerResultComponent
          }
        ]
      },
      {
        path: '',
        //redirectTo: 'homepage',
        redirectTo: '',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: 'profile',
    canActivate: [authGuard],
    canActivateChild: [authChildGuard],
    component: ProfileComponent, children: [
      {
        path: 'account',
        component: AccountComponent
      },
      {
        path: '',
        redirectTo: 'account',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'create-account',
    component: CreateAccountComponent
  },
  {
    path: '', redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: '**',
    component: NotfoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
