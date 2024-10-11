import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { PackingHelperService } from '../../services/packing-helper.service';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { ValueHelpPackinglist } from '../../types/value-help-packinglist';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { AppService } from '../../services/app.service';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-packinglist-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatListModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './packinglist-list.component.html',
  styleUrl: './packinglist-list.component.scss',
})
export class PackinglistListComponent {
  packingLists$!: Observable<ValueHelpPackinglist[]>;
  packingListType: string;
  apiPathMappings = {
    accomodation: 'accomodation',
    activity: 'activities',
    basics: 'basics',
    transport: 'transport',
    triptype: 'triptypes',
    weather: 'weather',
  };

  constructor(
    private packingBackend: PackingHelperService,
    private route: ActivatedRoute,
    private appService: AppService
  ) {
    this.packingListType = '';
  }

  ngOnInit(): void {
    const urlSegments = this.route.snapshot.url;
    this.packingListType = urlSegments[urlSegments.length - 1 || 0].path;
    this.packingLists$ = this.packingBackend.getPackingListsOfType(
      (this.apiPathMappings as any)[this.packingListType]
    );
    this.appService.setTitle(`Packlisten "${this.packingListType}"`);
  }

  onPackingListDelete(clickedList: ValueHelpPackinglist) {
    if (!confirm(`Packliste ${clickedList.name} löschen?`)) return;
    this.packingBackend.deletePackingList(clickedList.key).subscribe(() => {
      window.location.reload();
    });
  }
}
