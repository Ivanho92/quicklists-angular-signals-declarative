import { Component, effect, inject, signal } from '@angular/core';
import { ChecklistListHeaderComponent } from './components/checklist-list-header.component';
import { ChecklistListContentComponent } from './components/checklist-list-content.component';
import { ChecklistService } from './shared/checklist.service';
import { DialogComponent } from '../core/dialog.component';
import { Checklist } from './shared/checklist.model';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ChecklistFormComponent } from './components/checklist-form.component';

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
    <app-checklist-list-header
      (onAddChecklist)="checkListBeingEdited.set({})"
    />
    <app-checklist-list-content
      [checklists]="checklistService.checklists()"
      (onEditChecklist)="checkListBeingEdited.set($event)"
      (onDeleteChecklist)="checklistService.delete$.next($event)"
    />

    <app-dialog
      [show]="!!checkListBeingEdited()"
      (onClose)="checkListBeingEdited.set(null)"
    >
      <ng-template>
        <app-checklist-form
          [form]="checkListForm"
          [title]="
            checkListBeingEdited()?.id ? 'Edit checklist' : 'Create checklist'
          "
          (onClose)="checkListBeingEdited.set(null)"
          (onSave)="
            checkListBeingEdited()?.id
              ? checklistService.edit$.next({
                  id: checkListBeingEdited()!.id!,
                  data: checkListForm.getRawValue(),
                })
              : checklistService.add$.next(checkListForm.getRawValue())
          "
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
      } else {
        this.checkListForm.patchValue({
          title: this.checkListBeingEdited()?.title,
        });
      }
    });
  }
}
