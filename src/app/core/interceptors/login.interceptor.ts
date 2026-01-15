import { HttpInterceptorFn } from '@angular/common/http';

export const loginInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');


  if (req.url.includes('/api/clients/auth/')) {
    return next(req);
  }

  if (token) {
    const clonedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log(`Request: ${req.method} ${req.url}`, clonedReq.headers.get('Authorization'));
    return next(clonedReq);
  }

  return next(req);
};
