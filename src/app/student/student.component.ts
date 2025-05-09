import { Component, OnInit } from '@angular/core';
import { Student } from '../student';
import { StudentService } from '../student.service';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-student',
  standalone: false,
  templateUrl: './student.component.html',
  styleUrl: './student.component.css',
})
export class StudentComponent implements OnInit {
  students: Student[] = [];
  courses: any[] = [];
  formGroupStudent: FormGroup;
  isEditMode: boolean = false;
  currentStudentId: number | null = null;

  constructor(
    private service: StudentService,
    private formBuilder: FormBuilder
  ) {
    this.formGroupStudent = formBuilder.group({
      id: [''],
      name: [''],
      course: [''],
    });
  }

  ngOnInit(): void {
    this.loadStudents();
    this.loadCourses();
  }

  loadStudents() {
    this.service.getAll().subscribe({
      next: (json) => (this.students = json),
    });
  }

  loadCourses() {
    this.service.getSelect().subscribe({
      next: (json) => (this.courses = json),
    });
  }

  save() {
    this.service.save(this.formGroupStudent.value).subscribe({
      next: (json) => {
        this.students.push(json);
        this.formGroupStudent.reset();
      },
    });
  }

  delete(student: Student) {
    this.service.delete(student).subscribe({
      next: () => this.loadStudents(),
    });
  }

  edit(student: Student) {
    this.isEditMode = true;
    this.currentStudentId = student.id;
    this.formGroupStudent.setValue({
      id: student.id,
      name: student.name,
      course: student.course,
    });
  }

  closeEditMode() {
    this.isEditMode = false;
    this.formGroupStudent.reset();
  }

  update() {
    const updatedStudent = this.formGroupStudent.value;
    this.service.update(updatedStudent).subscribe({
      next: () => {
        this.loadStudents();
        this.closeEditMode();
      },
    });
  }

}
