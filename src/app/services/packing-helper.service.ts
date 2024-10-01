import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { PackingListType } from '../types/packing-list-type';
import { HttpClient } from '@angular/common/http';
import { ValueHelpPackinglist } from '../types/value-help-packinglist';

@Injectable({
  providedIn: 'root',
})
export class PackingHelperService {
  private BASE_PATH = '/api';
  constructor(private http: HttpClient) {}

  getPackingListTypes(): Observable<PackingListType[]> {
    return this.http
      .get<PackingListType[]>(this.BASE_PATH + '/listtypes')
      .pipe(
        catchError(this.handleError<PackingListType[]>(`get /listtypes`, []))
      );
  }

  getPackingListsOfType(typePath: string): Observable<ValueHelpPackinglist[]> {
    return this.http
      .get<ValueHelpPackinglist[]>(this.BASE_PATH + "/" + typePath)
      .pipe(
        catchError(
          this.handleError<ValueHelpPackinglist[]>(`get /${typePath}`, [])
        )
      );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   *
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      console.error(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}