import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { LandingPageComponent } from './landing-page.component';
import { describe, expect } from "jasmine";

describe('LandingPageComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      declarations: [
        LandingPageComponent
      ],
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(LandingPageComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'syllabuddy'`, () => {
    const fixture = TestBed.createComponent(LandingPageComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('syllabuddy');
  });

  it('should render title in a h1 tag', () => {
    const fixture = TestBed.createComponent(LandingPageComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('Welcome to syllabuddy!');
  });
});
