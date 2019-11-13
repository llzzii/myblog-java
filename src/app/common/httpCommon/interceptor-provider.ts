import { HTTP_INTERCEPTORS } from "@angular/common/http";

import { AuthInterceptor } from "./auth-interceptor";
import { HttpErrorInterceptor } from "./http-error-interceptor";

export const InterceptorProvider = [
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true },
];
