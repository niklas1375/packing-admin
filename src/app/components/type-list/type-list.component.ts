import { Component } from '@angular/core';
import { PackingHelperService } from '../../services/packing-helper.service';
import { MatListModule } from '@angular/material/list';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { PackingListType } from '../../types/packing-list-type';

@Component({
  selector: 'app-type-list',
  standalone: true,
  imports: [MatListModule, CommonModule],
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
