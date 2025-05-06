import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NovaDenunciaComponent } from './nova-denuncia.component';

describe('NovaDenunciaComponent', () => {
  let component: NovaDenunciaComponent;
  let fixture: ComponentFixture<NovaDenunciaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NovaDenunciaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NovaDenunciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
