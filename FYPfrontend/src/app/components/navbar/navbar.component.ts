import { ActivationEnd, NavigationEnd, ResolveStart, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {

  showLogoutButton: boolean = true;

  constructor(private router: Router) {
    this.router.events.subscribe((event) => {
      //console.log(this.router)
      if (event instanceof NavigationEnd) {
        if (event.url === '/login' || event.url === '/'||event.url==='/create-account') {
          this.showLogoutButton = false;
        } else {
          this.showLogoutButton = true;
        }
        console.log('NavigationEnd')
      }
    });
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
