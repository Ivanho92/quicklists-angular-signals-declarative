import { Component, input, output } from '@angular/core';
import { KeyValuePipe, TitleCasePipe } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-checklist-form',
  imports: [KeyValuePipe, ReactiveFormsModule, TitleCasePipe],
  host: {
    class: 'flow',
  },
  template: `
    <header>
      <h2>{{ title() }}</h2>
    </header>
    <section>
      <form
        id="checklist-form"
        [formGroup]="form()"
        (ngSubmit)="onSave.emit(); onClose.emit()"
      >
        @for (control of form().controls | keyvalue; track control.key) {
          <div class="stack">
            <label [for]="control.key">{{ control.key | titlecase }}</label>
            <input
              type="text"
              [id]="control.key"
              [formControlName]="control.key"
            />
          </div>
        }
      </form>
    </section>
    <footer class="cluster">
      <button (click)="onClose.emit()" data-severity="secondary">Cancel</button>
      <button type="submit" form="checklist-form" [disabled]="!form().valid">
        Save
      </button>
    </footer>
  `,
})
export class ChecklistFormComponent {
  title = input.required<string>();
  form = input.required<FormGroup>();

  onSave = output();
  onClose = output();
}
