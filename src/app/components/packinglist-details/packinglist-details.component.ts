import { Component } from '@angular/core';
import { PackingHelperService } from '../../services/packing-helper.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
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

  constructor(
    private formBuilder: FormBuilder,
    private packingBackend: PackingHelperService,
    private route: ActivatedRoute,
    private appService: AppService
  ) {}

  ngOnInit(): void {
    this.packinglistTypes$ = this.packingBackend.getPackingListTypes();
    this.listid = this.route.snapshot.params['listid'];

    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      type: ['', Validators.required],
    });

    if (this.listid === 'new') return;

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

  onItemEdit($event: MouseEvent, _t60: PackingItem) {
    throw new Error('Method not implemented.');
  }
  onItemDelete($event: MouseEvent, _t60: PackingItem) {
    throw new Error('Method not implemented.');
  }

  get f() {
    return this.form.controls;
  }

  onChange() {
    this.changed = true;
  }

  onSubmit() {
    this.submitted = true;

    if (this.form.invalid) {
      return;
    }

    this.submitting = true;
    this.savePackinglist();
  }

  private savePackinglist() {
    return this.listid === 'new'
      ? this.packingBackend.createPackingList(this.form.value)
      : this.packingBackend.updatePackingList(this.listid, this.form.value);
  }
}
