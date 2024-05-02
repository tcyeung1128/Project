import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, map } from 'rxjs';
import { SweetalertService } from '../@services/sweetalert.service';

@Injectable({
  providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor {

  constructor(private injector: Injector, private router: Router, private sweetalertService: SweetalertService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const jwt = localStorage.getItem('jwt');
    if (jwt) {
      req = req.clone({
        headers: req.headers.set('Authorization', jwt)
      });
    }

    return next.handle(req).pipe(
      map(event => {
        if (event instanceof HttpResponse) {
          if (event.body.status === 1) {
            console.log('Interceptor', event.body)
            event = this.success(event);
          } else if (event.body.status === 0) {
            console.log('Interceptor', event.body)
            event = this.error(event);
            //this.router.navigate(['/**']);
          } else if (event.body.status === -1) {
            console.log('Interceptor', event.body)
            event = this.error(event);
            this.router.navigate(['/login']);
          } else {

          }
        }
        return event;
      })
    );
  }

  // private success(event: any): any {
  //   if (event.body.data) {
  //     return event.clone({ body: event.body.data });
  //   } else {
  //     return event.clone({ body: true });
  //   }

  // }

  // private error(event: any): any {
  //   alert(event.body.message);

  //   return event.clone({ body: false });
  // }

  private success(event: any): any {
    if (event.body.data && event.body.maxPage>=0) {
      console.log(event.clone({ body: event.body.data, maxPage: event.body.maxPage }))
      return event.clone({ body: { data: event.body.data, maxPage: event.body.maxPage } });
    } else if (event.body.data) {
      return event.clone({ body: event.body.data });
    } else {
      return event.clone({ body: true });
    }

  }

  private error(event: any): any {
    console.log(event.body.message);
    this.sweetalertService.dialog(event.body.message)
    return event.clone({ body: false });
  }

}
