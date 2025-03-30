export interface FileUploadForm {
  files: File[];
}

export interface FileUploadControl {
  onChange: (value: File[]) => void;
  onTouch: () => void;
}