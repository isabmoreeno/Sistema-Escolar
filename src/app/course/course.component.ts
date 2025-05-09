import { Component, OnInit } from '@angular/core';
import { Course } from '../course';
import { CourseService } from '../course.service';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-course',
  standalone: false,
  templateUrl: './course.component.html',
  styleUrl: './course.component.css',
})
export class CourseComponent implements OnInit {
  courses: Course[] = [];
  formGroupCourse: FormGroup;
  isEditMode: boolean = false;
  currentCourseId: number | null = null;

  constructor(
    private service: CourseService,
    private formBuilder: FormBuilder
  ) {
    this.formGroupCourse = formBuilder.group({
      id: [''],
      course: [''],
      abbreviation: [''],
      axis: [''],
      schedule: ['']
    });
  }

  ngOnInit(): void {
    this.loadCourse();
  }

  loadCourse() {
    this.service.getCourses().subscribe({
      next: (json) => (this.courses = json),
    });
  }

  saveCourse() {
    this.service.saveCourse(this.formGroupCourse.value).subscribe({
      next: (json) => {
        this.courses.push(json);
        this.formGroupCourse.reset();
      },
    });
  }

  deleteCourse(course: Course) {
    this.service.deleteCourse(course).subscribe({
      next: () => this.loadCourse(),
    });
  }

  editCourse(course: Course) {
    this.isEditMode = true;
    this.currentCourseId = course.id;
    this.formGroupCourse.setValue({
      id: course.id,
      course: course.course,
      abbreviation: course.abbreviation,
      axis: course.axis,
      schedule: course.schedule
    });
  }

  closeEditMode() {
    this.isEditMode = false;
    this.formGroupCourse.reset();
  }

  updateCourse() {
    const updatedCourse = this.formGroupCourse.value;
    this.service.updateCourse(updatedCourse).subscribe({
      next: () => {
        this.loadCourse();
        this.closeEditMode();
      },
    });
  }
}
