import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PackingitemDetailsComponent } from './packingitem-details.component';

describe('PackingitemDetailsComponent', () => {
  let component: PackingitemDetailsComponent;
  let fixture: ComponentFixture<PackingitemDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PackingitemDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PackingitemDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
