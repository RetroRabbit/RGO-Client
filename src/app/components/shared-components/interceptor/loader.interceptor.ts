import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { finalize, Observable } from 'rxjs';
import { LoaderService } from 'src/app/services/shared-services/loader-service/loader.service';

@Injectable()
export class LoaderInterceptor implements HttpInterceptor {

  constructor(private loaderService: LoaderService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.loaderService.showSpinnerElement();
    const timer = setTimeout(() => {
      this.loaderService.hideSpinnerElement();
    }, 500);
    return next.handle(request).pipe(
      finalize(() => {
        clearTimeout(timer);
        this.loaderService.hideSpinnerElement()
      })
    );
  }
}
