import {
  Component,
  contentChild,
  effect,
  inject,
  input,
  output,
  TemplateRef,
} from '@angular/core';
import { Dialog } from '@angular/cdk/dialog';

@Component({
  selector: 'app-dialog',
  template: '',
})
export class DialogComponent {
  dialog = inject(Dialog);

  show = input.required<boolean>();
  template = contentChild.required(TemplateRef);

  onClose = output();

  constructor() {
    effect(() => {
      if (this.show()) {
        const dialogRef = this.dialog.open(this.template());
        dialogRef.closed.subscribe(() => this.onClose.emit());
      } else {
        this.dialog.closeAll();
      }
    });
  }
}
