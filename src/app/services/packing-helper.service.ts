import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { PackingListType } from '../types/packing-list-type';
import { HttpClient } from '@angular/common/http';
import { ValueHelpPackinglist } from '../types/value-help-packinglist';
import { PackingList } from '../types/packing-list';
import { PackingItem } from '../types/packing-item';
import { ValueHelpWeather } from '../types/value-help-weather';

@Injectable({
  providedIn: 'root',
})
export class PackingHelperService {
  private BASE_PATH = '/api';
  apiPathMappings = {
    accomodation: 'accomodation',
    activity: 'activities',
    basics: 'basics',
    transport: 'transport',
    triptype: 'triptypes',
    weather: 'weather',
  };
  constructor(private http: HttpClient) {}

  // packing list methods

  getPackingListTypes(): Observable<PackingListType[]> {
    return this.http
      .get<PackingListType[]>(this.BASE_PATH + '/listtypes')
      .pipe(
        catchError(this.handleError<PackingListType[]>(`get /listtypes`, []))
      );
  }

  getPackingListsOfType(typePath: string): Observable<ValueHelpPackinglist[]> {
    return this.http
      .get<ValueHelpPackinglist[]>(this.BASE_PATH + '/' + typePath)
      .pipe(
        catchError(
          this.handleError<ValueHelpPackinglist[]>(`get /${typePath}`, [])
        )
      );
  }

  getPackingListWithItems(listId: string): Observable<PackingList> {
    return this.http
      .get<PackingList>(
        this.BASE_PATH + '/packinglists/' + listId + '?expand=items'
      )
      .pipe(
        catchError(
          this.handleError<PackingList>(
            `get /packinglists/${listId}`,
            undefined
          )
        )
      );
  }

  updatePackingList(listId: string, value: Partial<PackingList>) {
    return this.http
      .patch<PackingList>(this.BASE_PATH + '/packinglists/' + listId, value, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .pipe(
        catchError(
          this.handleError<PackingList>(`patch /packinglists`, undefined)
        )
      );
  }

  createPackingList(value: Partial<PackingList>) {
    const path =
      this.BASE_PATH + '/' + (this.apiPathMappings as any)[value.type!];
    return this.http
      .post<PackingList>(path, value, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .pipe(
        catchError(
          this.handleError<PackingList>(`post /packinglists`, undefined)
        )
      );
  }

  deletePackingList(listId: string) {
    return this.http
      .delete(this.BASE_PATH + '/packinglists/' + listId)
      .pipe(
        catchError(
          this.handleError(`delete /packinglists/${listId}`, undefined)
        )
      );
  }

  // packing item methods

  getPackingItem(itemId: string, listId: string): Observable<PackingItem> {
    return this.http
      .get<PackingItem>(
        this.BASE_PATH + `/packinglists/${listId}/items/${itemId}`
      )
      .pipe(
        catchError(
          this.handleError<PackingItem>(
            `get /packinglists/${listId}/items/${itemId}`,
            undefined
          )
        )
      );
  }

  updatePackingItemOnList(
    listId: string,
    itemId: string,
    value: Partial<PackingItem>
  ) {
    return this.http
      .patch<PackingItem>(
        this.BASE_PATH + `/packinglists/${listId}/items/${itemId}`,
        value,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
      .pipe(
        catchError(
          this.handleError<PackingItem>(
            `patch /packinglists/${listId}/items/${itemId}`,
            undefined
          )
        )
      );
  }

  createPackingItemForList(listId: string, value: Partial<PackingItem>) {
    const path = this.BASE_PATH + `/packinglists/${listId}/items`;
    return this.http
      .post<PackingItem>(path, value, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .pipe(
        catchError(
          this.handleError<PackingItem>(
            `post /packinglists/${listId}/items`,
            undefined
          )
        )
      );
  }

  deletePackingItemFromList(listId: string, itemId: string) {
    return this.http
      .delete(this.BASE_PATH + `/packinglists/${listId}/items/${itemId}`)
      .pipe(
        catchError(
          this.handleError(
            `delete /packinglists/${listId}/items/${itemId}`,
            undefined
          )
        )
      );
  }

  // others

  getWeathers(): Observable<ValueHelpWeather[]> {
    return this.http
      .get<ValueHelpWeather[]>(this.BASE_PATH + '/weather')
      .pipe(
        catchError(
          this.handleError<ValueHelpWeather[]>(`get /weather`, [])
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
