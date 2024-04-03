import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class LocationApiService {
  constructor(private http: HttpClient) {}

  getCountries(): Observable<string[]> {
    return this.http.get<any>('https://countriesnow.space/api/v0.1/countries').pipe(
      map(response => response.data.map((country: { country: string }) => country.country))
    );
  }

  getProvinces(country: string): Observable<string[]> {
    return this.http.post<any>('https://countriesnow.space/api/v0.1/countries/states', { country }).pipe(
      map(response => response.data.states.map((state: any) => state.name))
    );
  }

  getCities(country: string, province: string): Observable<string[]> {
    return this.http.post<any>('https://countriesnow.space/api/v0.1/countries/state/cities', { country, state: province }).pipe(
      map(response => response.data)
    );
  }
}
