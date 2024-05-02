import { CanActivateFn, Router } from '@angular/router';
import { authGuard } from './auth.guard';
import { inject } from '@angular/core';

export const authChildGuard: CanActivateFn = (route, state) => {
  return authGuard(route, state);
};
