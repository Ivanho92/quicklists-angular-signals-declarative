import { Component, effect, inject, signal } from '@angular/core';
import { ChecklistListHeaderComponent } from './checklist-list/ui/checklist-list-header.component';
import { ChecklistListContentComponent } from './checklist-list/ui/checklist-list-content.component';
import { ChecklistService } from './shared/checklist.service';
import { DialogComponent } from '../core/dialog.component';
import { Checklist } from './shared/checklist.model';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ChecklistFormComponent } from './checklist-form/checklist-form.component';

@Component({
  imports: [
    ChecklistListHeaderComponent,
    ChecklistListContentComponent,
    DialogComponent,
    ReactiveFormsModule,
    ChecklistFormComponent,
  ],
  selector: 'app-checklist-list-page',
  template: `
    <app-checklist-list-header (onAddChecklist)="checkListBeingEdited.set({})" />
    <app-checklist-list-content [checklists]="checklistService.checklists()" />

    <app-dialog
      [show]="!!checkListBeingEdited()"
      (onClose)="checkListBeingEdited.set(null)"
    >
      <ng-template>
        <app-checklist-form
          [form]="checkListForm"
          (onSave)="checklistService.add$.next(checkListForm.getRawValue())"
          (onClose)="checkListBeingEdited.set(null)"
        />
      </ng-template>
    </app-dialog>
  `,
})
export default class ChecklistListPageComponent {
  protected readonly checklistService = inject(ChecklistService);
  private readonly fb = inject(FormBuilder);

  checkListBeingEdited = signal<Partial<Checklist> | null>(null);

  checkListForm = this.fb.nonNullable.group({
    title: ['', Validators.required],
  });

  constructor() {
    effect(() => {
      if (!this.checkListBeingEdited()) {
        this.checkListForm.reset();
      }
    });
  }
}
