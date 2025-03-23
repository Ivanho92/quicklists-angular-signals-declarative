import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Checklist, ChecklistId } from '../shared/checklist.model';

@Component({
  selector: 'app-checklist-detail-header',
  template: `
    <header>
      <a routerLink="/">Back</a>
      <h1>
        {{ checklist().title }}
      </h1>

      <button
        [disabled]="!hasCompletedItems()"
        (click)="onResetChecklist.emit(checklist().id)"
      >
        Reset
      </button>
      <button (click)="onAddItem.emit()">Add item</button>
    </header>
  `,
  imports: [RouterLink],
})
export class ChecklistHeaderComponent {
  checklist = input.required<Checklist>();
  hasCompletedItems = input.required<boolean>();

  onAddItem = output();
  onResetChecklist = output<ChecklistId>();
}
