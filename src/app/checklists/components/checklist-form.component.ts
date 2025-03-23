import { Component, input, output } from '@angular/core';
import { KeyValuePipe } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-checklist-form',
  imports: [KeyValuePipe, ReactiveFormsModule],
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
          <div>
            <label [for]="control.key">{{ control.key }}</label>
            <input
              type="text"
              [id]="control.key"
              [formControlName]="control.key"
            />
          </div>
        }
      </form>
    </section>
    <footer>
      <button (click)="onClose.emit()">Cancel</button>
      <button type="submit" form="checklist-form" [disabled]="!form().valid">
        Save
      </button>
    </footer>
  `,
  styles: `
    :host {
      display: block;
      background: #fff;
      padding: .5em 1em;
    }
  `,
})
export class ChecklistFormComponent {
  title = input.required<string>();
  form = input.required<FormGroup>();

  onSave = output();
  onClose = output();
}
