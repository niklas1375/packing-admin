import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PackinglistDetailsComponent } from './packinglist-details.component';

describe('PackinglistDetailsComponent', () => {
  let component: PackinglistDetailsComponent;
  let fixture: ComponentFixture<PackinglistDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PackinglistDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PackinglistDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
