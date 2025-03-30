import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { FileUploadForm } from './types/file-upload.types';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FileUploadComponent]
})
export class AppComponent {
  form = this.fb.group({
    files: new FormControl<File[]>([])
  });

  constructor(private fb: FormBuilder) {}

  get files(): File[] {
    return this.form.get('files')?.value || [];
  }

  removeFile(index: number) {
    const currentFiles = [...this.files];
    currentFiles.splice(index, 1);
    this.form.get('files')?.setValue(currentFiles);
  }
}