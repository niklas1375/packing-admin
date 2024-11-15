import { Component, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Observable } from 'rxjs';
import { PackingItem } from '../../types/packing-item';
import {
  FormBuilder,
  FormControl,
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
      dayMultiplier: [''],
      dayThreshold: [''],
      onlyIfWeekday: [false],
      onlyIfAbroad: [false],
      weather: this.formBuilder.group({
        cold: [false],
        wet: [false],
        warm: [false],
        sunny: [false],
      }),
      afterReturn: [false],
      dueShift: [''],
      additionalLabels: [''],
      addTripNameToTask: [false],
    });

    // remove pseudo item from additionalLabels Signal
    this.additionalLabels.update((_) => {
      return [];
    });

    // 'new' route is matched 'packinglist/:listid/items/new/:category'
    if (this.itemcategory) {
      this.f['category'].patchValue(this.itemcategory);
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
      this.loading = false;
      this.appService.setTitle(
        `Packitem ${packingItem.name} (${packingItem.category})`
      );
    });
  }

  private _setUpWeatherRelevance(packingItem: PackingItem) {
    this.form.patchValue({
      weatherRelevanceChecked:
        packingItem.relevantForWeather &&
        packingItem.relevantForWeather.length > 0,
    });
    this.weathers$.subscribe((weathers) => {
      if (!packingItem.relevantForWeather) {
        this.isWeatherRelevant.update((_) => false);
        return;
      }
      this.isWeatherRelevant.update((_) => true);
      const weather = {
        cold: false,
        wet: false,
        warm: false,
        sunny: false,
      };

      weathers
        .filter((w) => packingItem.relevantForWeather!.indexOf(w.key) >= 0)
        .forEach((w) => {
          switch (w.name) {
            case 'Kaltes Wetter':
              weather.cold = true;
              break;
            case 'Nasses Wetter':
              weather.wet = true;
              break;
            case 'Warmes Wetter':
              weather.warm = true;
              break;
            case 'Sonniges Wetter':
              weather.sunny = true;
              break;

            default:
              break;
          }
        });
      this.form.patchValue({
        weather: weather,
      });
    });
  }

  newFormControl(key: string, formGroup: FormGroup): string {
    formGroup.registerControl(key, new FormControl());
    return key;
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
      this.additionalLabels.update((labels) => [...labels, value]);
    }

    // Clear the input value
    event.chipInput!.clear();
  }

  removeAdditionalLabel(keyword: string) {
    this.additionalLabels.update((labels) => {
      const index = labels.indexOf(keyword);
      if (index < 0) {
        return labels;
      }
      labels.splice(index, 1);
      return [...labels];
    });
  }

  onSubmit() {}
}
