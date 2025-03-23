import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Checklist, ChecklistId } from '../shared/checklist.model';

@Component({
  selector: 'app-checklist-detail-header',
  host: { class: 'd-block' },
  template: `
    <header class="wrapper">
      <div class="stack">
        <a routerLink="/" class="no-underline">&lt; Back</a>
        <div class="cluster space-between">
          <h1>
            {{ checklist().title }}
          </h1>

          <div class="cluster">
            <button
              [disabled]="!hasCompletedItems()"
              (click)="onResetChecklist.emit(checklist().id)"
              data-severity="secondary"
            >
              Reset
            </button>
            <button (click)="onAddItem.emit()">Add Item</button>
          </div>
        </div>
      </div>
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
