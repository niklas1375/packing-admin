import { Component } from '@angular/core';
import { PackingHelperService } from '../../services/packing-helper.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { PackingList } from '../../types/packing-list';
import { AppService } from '../../services/app.service';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { PackingListType } from '../../types/packing-list-type';
import { AsyncPipe } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { PackingItem } from '../../types/packing-item';
import { EllipsisPipe } from '../../pipes/ellipsis.pipe';
import { PackingCategory } from '../../types/packing-category';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-packinglist-details',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatListModule,
    MatIconModule,
    MatExpansionModule,
    MatSnackBarModule,
    AsyncPipe,
    EllipsisPipe,
    RouterLink,
  ],
  templateUrl: './packinglist-details.component.html',
  styleUrl: './packinglist-details.component.scss',
})
export class PackinglistDetailsComponent {
  packingList$!: Observable<PackingList>;
  form!: FormGroup;
  listid?: string;
  listtype?: string;
  loading = false;
  submitting = false;
  submitted = false;
  changed = false;
  packinglistTypes$!: Observable<PackingListType[]>;
  packingCategories: PackingCategory[] = [
    {
      name: 'Kleidung',
      content: [],
    },
    {
      name: 'Hygiene & Co.',
      content: [],
    },
    {
      name: 'Ausrüstung',
      content: [],
    },
    {
      name: 'Organisatorisches',
      content: [],
    },
    {
      name: 'Unterhaltung',
      content: [],
    },
    {
      name: 'sonstiges',
      content: [],
    },
  ];
  categoryMapping = [
    'clothing',
    'toiletries',
    'gear',
    'organisational',
    'entertainment',
    'other',
  ];
  categoryBackMapping = {
    Kleidung: 'clothing',
    'Hygiene & Co.': 'toiletries',
    Ausrüstung: 'gear',
    Organisatorisches: 'organisational',
    Unterhaltung: 'entertainment',
    sonstiges: 'other',
  };

  constructor(
    private formBuilder: FormBuilder,
    private packingBackend: PackingHelperService,
    private route: ActivatedRoute,
    private appService: AppService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.packinglistTypes$ = this.packingBackend.getPackingListTypes();
    this.listid = this.route.snapshot.params['listid'];
    this.listtype = this.route.snapshot.params['type'];

    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      type: ['', Validators.required],
    });

    if (this.listtype) {
      this.f['type'].patchValue(this.listtype);
      return;
    }

    this.loading = true;
    this.packingList$ = this.packingBackend.getPackingListWithItems(
      this.listid!
    );
    this.packingList$.subscribe((packingList) => {
      this.form.patchValue(packingList);
      this.loading = false;
      this.appService.setTitle(
        `Packliste ${packingList.name} (${packingList.type})`
      );
      if (packingList.name === 'Basics') {
        this.f['name'].disable();
        this.f['type'].disable();
      }
      packingList.packingItems?.forEach((item) => {
        const index = this.categoryMapping.indexOf(item.category);
        this.packingCategories[index].content.push(item);
      });
    });
  }

  onItemDelete(item: PackingItem) {
    const canDelete = confirm(
      `Packitem ${item.name} von Liste ${this.f['name'].getRawValue()} löschen?`
    );
    if (!canDelete) return;
    this.packingBackend
      .deletePackingItemFromList(this.listid!, item.item_id)
      .subscribe(() => {
        window.location.reload();
      });
  }

  get f() {
    return this.form.controls;
  }

  onChange() {
    this.changed = true;
  }

  async onSubmit() {
    this.submitted = true;

    if (this.form.invalid) {
      this.snackBar.open('Es fehlt Name und/oder Typ');
      return;
    }

    this.submitting = true;
    const returnItem$: Observable<PackingList> | undefined =
      this.savePackinglist();
    if (!returnItem$) return;
    if (!!this.listtype) {
      returnItem$.subscribe((packingList) => {
        this.router.navigate(['/packinglist/' + packingList.id]);
      });
    } else {
      returnItem$.subscribe(() => {
        window.location.reload();
      });
    }
  }

  mapCategory(category: string) {
    return (this.categoryBackMapping as any)[category];
  }

  private savePackinglist() {
    if (!this.form.value['name'] || !this.form.value['type']) {
      this.snackBar.open('Es fehlt Name und/oder Typ');
      return;
    }
    return !!this.listtype
      ? this.packingBackend.createPackingList(this.form.value)
      : this.packingBackend.updatePackingList(this.listid!, this.form.value);
  }
}
