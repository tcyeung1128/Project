import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { ProblemSetServiceApiService } from '../@services-api/problem-set-service-api.service';

export const problemSetPagesResolver: ResolveFn<any> =
  (route, state) => {
    return inject(ProblemSetServiceApiService).getProblemSetItem(route.paramMap.get('guid') as string);
  };

