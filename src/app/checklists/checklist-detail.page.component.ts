import { Component, computed, effect, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { ChecklistService } from './shared/checklist.service';
import { ChecklistHeaderComponent } from './components/checklist-detail-header.component';
import { ChecklistItem } from './shared/checklist-item.model';
import { NonNullableFormBuilder, Validators } from '@angular/forms';
import { ChecklistFormComponent } from './components/checklist-form.component';
import { DialogComponent } from '../core/dialog.component';
import { ChecklistItemService } from './shared/checklist-item.service';
import { ChecklistDetailContentComponent } from './components/checklist-detail-content.component';

@Component({
  imports: [
    ChecklistDetailContentComponent,
    ChecklistFormComponent,
    ChecklistHeaderComponent,
    DialogComponent,
  ],
  selector: 'app-checklist-detail-page',
  template: `
    @if (checklist(); as checklist) {
      <app-checklist-detail-header
        [checklist]="checklist"
        [hasCompletedItems]="hasCompletedItems()"
        (onAddItem)="checklistItemBeingEdited.set({})"
        (onResetChecklist)="checklistItemService.reset$.next($event)"
      />

      <app-checklist-detail-content
        [checklistItems]="items()"
        (onEditItem)="checklistItemBeingEdited.set($event)"
        (onDeleteItem)="checklistItemService.delete$.next($event)"
        (onToggleItem)="checklistItemService.toggle$.next($event)"
      />

      <app-dialog
        [show]="!!checklistItemBeingEdited()"
        (onClose)="checklistItemBeingEdited.set(null)"
      >
        <ng-template>
          <app-checklist-form
            [form]="checklistItemForm"
            [title]="
              checklistItemBeingEdited()?.id ? 'Edit item' : 'Create item'
            "
            (onClose)="checklistItemBeingEdited.set(null)"
            (onSave)="
              checklistItemBeingEdited()?.id
                ? checklistItemService.edit$.next({
                    id: checklistItemBeingEdited()?.id!,
                    item: checklistItemForm.getRawValue(),
                  })
                : checklistItemService.add$.next({
                    item: checklistItemForm.getRawValue(),
                    checklistId: checklist.id,
                  })
            "
          />
        </ng-template>
      </app-dialog>
    }
  `,
})
export default class ChecklistDetailPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly checklistService = inject(ChecklistService);
  protected readonly checklistItemService = inject(ChecklistItemService);
  private readonly fb = inject(NonNullableFormBuilder);

  params = toSignal(this.route.paramMap);

  checklist = computed(() =>
    this.checklistService
      .checklists()
      .find((checklist) => checklist.id === +this.params()!.get('id')!),
  );

  items = computed(() =>
    this.checklistItemService
      .checklistItems()
      .filter((item) => item.checklistId === +this.params()!.get('id')!),
  );

  hasCompletedItems = computed(
    () =>
      !!this.checklistItemService
        .checklistItems()
        .find(
          (item) => item.checklistId === this.checklist()?.id && item.checked,
        ),
  );

  checklistItemForm = this.fb.group({
    title: ['', Validators.required],
  });

  checklistItemBeingEdited = signal<Partial<ChecklistItem> | null>(null);

  constructor() {
    effect(() => {
      if (!this.checklistItemBeingEdited()) {
        this.checklistItemForm.reset();
      } else {
        this.checklistItemForm.patchValue({
          title: this.checklistItemBeingEdited()?.title,
        });
      }
    });
  }
}
