import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { PackingHelperService } from '../../services/packing-helper.service';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { ValueHelpPackinglist } from '../../types/value-help-packinglist';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-packinglist-list',
  standalone: true,
  imports: [CommonModule, RouterLink, MatListModule, MatIconModule],
  templateUrl: './packinglist-list.component.html',
  styleUrl: './packinglist-list.component.scss',
})
export class PackinglistListComponent {
  packingLists$!: Observable<ValueHelpPackinglist[]>;
  packingListType: string;
  constructor(
    private packingBackend: PackingHelperService,
    private route: ActivatedRoute
  ) {
    this.packingListType = '';
  }

  ngOnInit(): void {
    const urlSegments = this.route.snapshot.url;
    this.packingListType = urlSegments[urlSegments.length - 1 || 0].path;
    this.packingLists$ = this.packingBackend.getPackingListsOfType(
      this.packingListType
    );
  }
}
