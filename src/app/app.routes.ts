import { Routes } from '@angular/router';
import { TypeListComponent } from './components/type-list/type-list.component';
import { PackinglistListComponent } from './components/packinglist-list/packinglist-list.component';
import { PackinglistDetailsComponent } from './components/packinglist-details/packinglist-details.component';
import { PackingitemDetailsComponent } from './components/packingitem-details/packingitem-details.component';

export const routes: Routes = [
  {
    path: '',
    component: TypeListComponent,
  },
  {
    path: 'types',
    component: TypeListComponent,
  },
  {
    path: 'types/:type',
    component: PackinglistListComponent,
  },
  {
    path: 'packinglist/:listid',
    component: PackinglistDetailsComponent,
  },
  {
    path: 'packinglist/:listid/items/:itemid',
    component: PackingitemDetailsComponent,
  },
];
