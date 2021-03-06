import { async, ComponentFixture, fakeAsync, flush, flushMicrotasks, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { CoursesModule } from './../courses.module';

import { HomeComponent } from './home.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CoursesService } from '../services/courses.service';
import { HttpClient } from '@angular/common/http';
import { COURSES } from '../../../../server/db-data';
import { setupCourses } from '../common/setup-test-data';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { click } from '../common/test-utils';
import * as e from 'express';




describe('HomeComponent', () => {

  let fixture: ComponentFixture<HomeComponent>;
  let component: HomeComponent;
  let el: DebugElement;
  let coursesService: any;

  const beginnerCourse = setupCourses().filter(course => course.category === 'BEGINNER');
  const advancedCourse = setupCourses().filter(course => course.category === 'ADVANCED')

  beforeEach(async(() => {

    let courseServiceSpy = jasmine.createSpyObj('CoursesService', ['findAllCourses'])

    TestBed.configureTestingModule({
      imports: [
        CoursesModule,
        NoopAnimationsModule
      ],
      providers: [
        { provide: CoursesService, useValue: courseServiceSpy }
      ]
    }).compileComponents().then(() => {
      fixture = TestBed.createComponent(HomeComponent);
      component = fixture.componentInstance;
      el = fixture.debugElement;
      coursesService = TestBed.get(CoursesService);
    })

  }));

  it("should create the component", () => {

    expect(component).toBeTruthy();

  });


  it("should display only beginner courses", () => {

    coursesService.findAllCourses.and.returnValue(of(beginnerCourse));
    fixture.detectChanges();

    const tabs = el.queryAll(By.css('.mat-tab-label'))

    expect(tabs.length).toBe(1, 'Unexpected Tabs found')

  });


  it("should display only advanced courses", () => {

    coursesService.findAllCourses.and.returnValue(of(advancedCourse));
    fixture.detectChanges()

    const tabs = el.queryAll(By.css('.mat-tab-label'))

    expect(tabs.length).toBe(1, 'Unexpected tabs list')

  });


  it("should display both tabs", () => {

    coursesService.findAllCourses.and.returnValue(of(setupCourses()));
    fixture.detectChanges()

    const tabs = el.queryAll(By.css('.mat-tab-label'))

    expect(tabs.length).toBe(2, 'Unexpected tabs list')

  });


  it("should display advanced courses when tab clicked with fakeAsync()", fakeAsync(() => {


    coursesService.findAllCourses.and.returnValue(of(setupCourses()));
    fixture.detectChanges();

    const tabs = el.queryAll(By.css(".mat-tab-label"));

    click(tabs[1]);
    fixture.detectChanges();

    flush();

    const cardTitles = el.queryAll(By.css('.mat-tab-body-active .mat-card-title'));

    expect(cardTitles.length).toBeGreaterThan(0,"Could not find card titles");
    expect(cardTitles[0].nativeElement.textContent).toContain("Angular Security Course");

  }));

  it("should display advanced courses when tab clicked with async()", async(() => {


    coursesService.findAllCourses.and.returnValue(of(setupCourses()));
    fixture.detectChanges();

    const tabs = el.queryAll(By.css(".mat-tab-label"));

    click(tabs[1]);
    fixture.detectChanges();

    fixture.whenStable().then(() => {

      const cardTitles = el.queryAll(By.css('.mat-tab-body-active .mat-card-title'));

      expect(cardTitles.length).toBeGreaterThan(0,"Could not find card titles");
      expect(cardTitles[0].nativeElement.textContent).toContain("Angular Security Course");
    })


  }));


  it("should display advanced courses when tab clicked with done()", (done: DoneFn) => {
    coursesService.findAllCourses.and.returnValue(of(setupCourses()));
    fixture.detectChanges();

    const tabs = el.queryAll(By.css(".mat-tab-label"));

    click(tabs[1]);
    fixture.detectChanges();

    
    setTimeout(() => {
      const cardTitles = el.queryAll(By.css('.mat-tab-body-active .mat-card-title'));

      expect(cardTitles.length).toBeGreaterThan(0,"Could not find card titles");
      expect(cardTitles[0].nativeElement.textContent).toContain("Angular Security Course");
      done();
    }, 500);

  });

});



