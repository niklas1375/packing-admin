import { Component } from '@angular/core';
import { PackingHelperService } from '../../services/packing-helper.service';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { PackingListType } from '../../types/packing-list-type';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-type-list',
  standalone: true,
  imports: [MatListModule, MatIconModule, CommonModule, RouterLink],
  templateUrl: './type-list.component.html',
  styleUrl: './type-list.component.scss',
})
export class TypeListComponent {
  packinglistTypes$!: Observable<PackingListType[]>;
  constructor(private packingBackend: PackingHelperService) {}

  ngOnInit(): void {
    this.packinglistTypes$ = this.packingBackend.getPackingListTypes();
  }
}
