import { HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class AuthInterceptor implements HttpInterceptor {
  token = localStorage.getItem("token");
  debugger;
  constructor() {}
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    let url = req.url;
    let authReq;
    let authToken = sessionStorage.getItem("token");
    let attributes = sessionStorage.getItem("token") || "1";
    if (authToken == null) {
      authReq = req.clone({
        setHeaders: {},
        url,
      });
    } else {
      authReq = req.clone({
        setHeaders: {
          Attributes: attributes,
          Authorization: "Bearer " + authToken,
        },
        url,
        /*withCredentials: true*/
      });
    }

    // send cloned request with header to the next handler.
    return next.handle(authReq);
  }
}
