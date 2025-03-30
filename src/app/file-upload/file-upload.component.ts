import { Component, forwardRef, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { FileUploadControl } from '../types/file-upload.types';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FileUploadComponent),
      multi: true
    }
  ]
})
export class FileUploadComponent implements ControlValueAccessor {

  nfb = inject(NonNullableFormBuilder);

  list = this.nfb.array<FormControl<File>>([])


  @Input() multiple = false;
  @Input() accept = '*/*';

  isDragging = false;
  onChange: FileUploadControl['onChange'] = () => {};
  onTouch: FileUploadControl['onTouch'] = () => {};

  writeValue(value: File[]): void {
    // Implementation not needed as we're using FormControl
  }

  registerOnChange(fn: FileUploadControl['onChange']): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: FileUploadControl['onTouch']): void {
    this.onTouch = fn;
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
    
    const files = event.dataTransfer?.files;
    if (files) {
      this.handleFiles(files);
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.handleFiles(input.files);
    }
  }
  
  private handleFiles(fileList: FileList) {
    console.log(fileList)
    const files = Array.from(fileList);
    if (this.multiple) {
      const currentFiles = this.onChange as unknown as File[];
      this.onChange([...currentFiles, ...files]);
    } else {
      const file = files[0];
      if (file) {
        this.onChange([file]);
      }
    }
    this.onTouch();
  }
}