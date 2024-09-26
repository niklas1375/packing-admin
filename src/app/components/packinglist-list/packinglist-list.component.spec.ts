import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PackinglistListComponent } from './packinglist-list.component';

describe('PackinglistListComponent', () => {
  let component: PackinglistListComponent;
  let fixture: ComponentFixture<PackinglistListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PackinglistListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PackinglistListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
