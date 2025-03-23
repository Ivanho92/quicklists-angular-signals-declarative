import { Component, input, output } from '@angular/core';
import { ChecklistItem, ChecklistItemId } from '../shared/checklist-item.model';

@Component({
  selector: 'app-checklist-detail-content',
  template: `
    <section>
      <ul>
        @for (item of checklistItems(); track item.id) {
          <li>
            <div>
              @if (item.checked) {
                ✔️
              }
              {{ item.title }}
              <button (click)="onToggleItem.emit(item.id)">Toggle</button>
              <button (click)="onEditItem.emit(item)">Edit</button>
              <button (click)="onDeleteItem.emit(item.id)">Delete</button>
            </div>
          </li>
        } @empty {
          <div>
            <h2>Add an item</h2>
            <p>Click the add button to add your first item to this quicklist</p>
          </div>
        }
      </ul>
    </section>
  `,
})
export class ChecklistDetailContentComponent {
  checklistItems = input.required<ChecklistItem[]>();

  onEditItem = output<ChecklistItem>();
  onDeleteItem = output<ChecklistItemId>();
  onToggleItem = output<ChecklistItemId>();
}
