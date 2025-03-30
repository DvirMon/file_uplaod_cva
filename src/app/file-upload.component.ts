import { Component, forwardRef, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, FormArray, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="file-upload">
      <div
        class="drop-zone"
        (dragover)="onDragOver($event)"
        (dragleave)="onDragLeave($event)"
        (drop)="onDrop($event)"
        [class.active]="isDragging"
      >
        <input
          #fileInput
          type="file"
          [multiple]="multiple"
          [accept]="accept"
          (change)="onFileSelected($event)"
          style="display: none"
        />
        <div class="upload-prompt">
          <p>Drag & drop files here or</p>
          <button type="button" (click)="fileInput.click()">Browse Files</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .file-upload {
      width: 100%;
      margin: 1rem 0;
    }
    .drop-zone {
      border: 2px dashed #ccc;
      border-radius: 4px;
      padding: 2rem;
      text-align: center;
      transition: all 0.3s ease;
      background: #fafafa;
    }
    .drop-zone.active {
      border-color: #2196F3;
      background: #E3F2FD;
    }
    .upload-prompt {
      color: #666;
    }
    .upload-prompt p {
      margin: 0 0 1rem 0;
    }
    button {
      background: #2196F3;
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      cursor: pointer;
      font-size: 1rem;
    }
    button:hover {
      background: #1976D2;
    }
  `],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FileUploadComponent),
      multi: true
    }
  ]
})
export class FileUploadComponent implements ControlValueAccessor {
  @Input() multiple = false;
  @Input() accept = '*/*';

  isDragging = false;
  onChange: any = () => {};
  onTouch: any = () => {};

  writeValue(value: any): void {
    // Implementation not needed as we're using FormArray
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
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
    const files = Array.from(fileList);
    if (this.multiple) {
      const formArray = this.onChange as FormArray;
      files.forEach(file => {
        formArray.push(this.createFileControl(file));
      });
    } else {
      const file = files[0];
      if (file) {
        this.onChange([this.createFileControl(file).value]);
      }
    }
    this.onTouch();
  }

  private createFileControl(file: File) {
    return new FormArray([file]);
  }
}