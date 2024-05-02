import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  function isDateWithin30Days(date: any) {
    let currentDate = new Date();
    let lastLoginDate = new Date(date);
    let timeDiff = currentDate.getTime() - lastLoginDate.getTime();
    let dayDiff = timeDiff / (1000 * 3600 * 24);
    if (dayDiff > 30) {
        return false
    } else {
        return true
    }
  }

  let jwt = localStorage.getItem('jwt');
  if (jwt) {
    const payload = JSON.parse(window.atob(jwt.split('.')[1]));
    console.log(payload)
    const lastLogin = new Date(payload.lastLogin);
    console.log(isDateWithin30Days(lastLogin))

    if (isDateWithin30Days(lastLogin) === false) {
      console.log('if')
      alert('JWT已過期，請重新登入');
      return inject(Router).createUrlTree(['/login']);
    }
  } else {
    alert('尚未登入');
    return inject(Router).createUrlTree(['/login']);
  }

  return true;
};
