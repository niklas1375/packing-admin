import { Routes } from '@angular/router';
import { TypeListComponent } from './components/type-list/type-list.component';
import { PackinglistListComponent } from './components/packinglist-list/packinglist-list.component';
import { PackinglistDetailsComponent } from './components/packinglist-details/packinglist-details.component';
import { PackingitemDetailsComponent } from './components/packingitem-details/packingitem-details.component';

export const routes: Routes = [
  {
    path: '',
    title: 'Packlistentypen',
    component: TypeListComponent,
  },
  {
    path: 'types',
    title: 'Packlistentypen',
    component: TypeListComponent,
  },
  {
    path: 'types/:type',
    title: 'Packlisten für Typ',
    component: PackinglistListComponent,
  },
  {
    path: 'packinglist/:listid',
    title: 'Packlistendetails',
    component: PackinglistDetailsComponent,
  },
  {
    path: 'packinglist/new/:type',
    title: 'Packliste erstellen',
    component: PackinglistDetailsComponent,
  },
  {
    path: 'packinglist/:listid/items/:itemid',
    title: 'Packitemdetails',
    component: PackingitemDetailsComponent,
  },
  {
    path: 'packinglist/:listid/items/new/:category',
    title: 'Packitem erstellen',
    component: PackingitemDetailsComponent,
  },
  {
    path: '**',
    title: 'Packlisten verwalten',
    component: TypeListComponent,
  },
];
