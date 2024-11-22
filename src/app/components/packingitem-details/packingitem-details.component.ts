import { Component, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Observable } from 'rxjs';
import { PackingItem } from '../../types/packing-item';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { PackingHelperService } from '../../services/packing-helper.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService } from '../../services/app.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ValueHelpWeather } from '../../types/value-help-weather';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-packingitem-details',
  standalone: true,
  imports: [
    MatCardModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatSlideToggleModule,
    MatCheckboxModule,
    MatChipsModule,
    MatIconModule,
  ],
  templateUrl: './packingitem-details.component.html',
  styleUrl: './packingitem-details.component.scss',
})
export class PackingitemDetailsComponent {
  packingListItem$!: Observable<PackingItem>;
  weathers$!: Observable<ValueHelpWeather[]>;
  isWeatherRelevant = signal(false);
  additionalLabels = signal<string[]>([]);
  form!: FormGroup;
  listid?: string;
  itemid?: string;
  itemcategory?: string;
  loading = false;
  submitting = false;
  submitted = false;
  changed = false;

  categoryMapping = [
    { key: 'clothing', name: 'Kleidung' },
    { key: 'toiletries', name: 'Hygiene & Co.' },
    { key: 'gear', name: 'Ausrüstung' },
    { key: 'organisational', name: 'Organisatorisches' },
    { key: 'entertainment', name: 'Unterhaltung' },
    { key: 'other', name: 'sonstiges' },
  ];

  constructor(
    private formBuilder: FormBuilder,
    private packingBackend: PackingHelperService,
    private route: ActivatedRoute,
    private appService: AppService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.weathers$ = this.packingBackend.getWeathers();
    this.listid = this.route.snapshot.params['listid'];
    this.itemid = this.route.snapshot.params['itemid'];
    this.itemcategory = this.route.snapshot.params['category'];

    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      category: ['', Validators.required],
      dayMultiplier: [undefined, Validators.pattern('^\-?[0-9]*$')],
      dayThreshold: [undefined, Validators.pattern('^\-?[0-9]*$')],
      onlyIfWeekday: [false],
      onlyIfAbroad: [false],
      weather: this.formBuilder.group({
        cold: [false],
        wet: [false],
        warm: [false],
        sunny: [false],
      }),
      afterReturn: [false],
      dueShift: [undefined, Validators.pattern('^\-?[0-9]*$')],
      addTripNameToTask: [false],
    });

    // 'new' route is matched 'packinglist/:listid/items/new/:category'
    if (this.itemcategory) {
      this.f['category'].patchValue(this.itemcategory);
      this.isWeatherRelevant.set(false);
      return;
    }

    this.loading = true;
    this.packingListItem$ = this.packingBackend.getPackingItem(
      this.itemid!,
      this.listid!
    );
    this.packingListItem$.subscribe((packingItem) => {
      this.form.patchValue(packingItem);
      this._setUpWeatherRelevance(packingItem);
      this.additionalLabels.set(packingItem.additionalLabels || []);
      this.loading = false;
      this.appService.setTitle(
        `Packitem ${packingItem.name} (${packingItem.category})`
      );
    });
  }

  private _setUpWeatherRelevance(packingItem: PackingItem) {
    if (
      !packingItem.relevantForWeather ||
      packingItem.relevantForWeather.length <= 0
    ) {
      this.isWeatherRelevant.set(false);
      return;
    }
    this.isWeatherRelevant.set(true);
    const weather = {
      cold: false,
      wet: false,
      warm: false,
      sunny: false,
    };
    Object.keys(weather).forEach((key) => {
      (weather as any)[key] = packingItem.relevantForWeather!.indexOf(key) > -1;
    });
    this.form.patchValue({
      weather: weather,
    });
  }

  get f() {
    return this.form.controls;
  }

  onChange() {
    this.changed = true;
  }

  addAdditionalLabel(event: MatChipInputEvent) {
    const value = (event.value || '').trim();

    // Add our keyword
    if (value) {
      this.changed = true;
      this.additionalLabels.update((labels) => [...labels, value]);
    }

    // Clear the input value
    event.chipInput!.clear();
  }

  removeAdditionalLabel(keyword: string) {
    this.changed = true;
    this.additionalLabels.update((labels) => {
      const index = labels.indexOf(keyword);
      if (index < 0) {
        return labels;
      }
      labels.splice(index, 1);
      return [...labels];
    });
  }

  onSubmit() {
    this.submitted = true;

    if (this.form.invalid) {
      this.snackBar.open('Es fehlt Name und/oder Kategorie');
      return;
    }

    this.submitting = true;
    const returnItem$: Observable<PackingItem> | undefined =
      this.savePackingItem();
    if (!returnItem$) return;
    if (!!this.itemcategory) {
      returnItem$.subscribe((packingItem) => {
        this.router.navigate([
          `/packinglist/${this.listid}/items/${packingItem.item_id}`,
        ]);
      });
    } else {
      returnItem$.subscribe(() => {
        window.location.reload();
      });
    }
  }

  private savePackingItem() {
    if (!this.form.value['name'] || !this.form.value['category']) {
      this.snackBar.open('Es fehlt Name und/oder Typ');
      return;
    }
    const copyObject = Object.assign({}, this.form.value);
    const weatherObject = Object.assign({}, copyObject.weather);
    delete copyObject.weather;
    const newPackingItem: PackingItem = copyObject;
    if (!newPackingItem.dueShift || copyObject.dueShift === '') {
      delete newPackingItem.dueShift;
    }
    newPackingItem.relevantForWeather = Object.keys(weatherObject).filter(
      (weatherKey) => weatherObject[weatherKey]
    );
    newPackingItem.additionalLabels = this.additionalLabels();

    return !!this.itemcategory
      ? this.packingBackend.createPackingItemForList(
          this.listid!,
          newPackingItem
        )
      : this.packingBackend.updatePackingItemOnList(
          this.listid!,
          this.itemid!,
          newPackingItem
        );
  }
}
