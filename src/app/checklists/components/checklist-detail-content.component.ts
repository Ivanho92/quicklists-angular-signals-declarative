import { Component, input, output } from '@angular/core';
import { ChecklistItem, ChecklistItemId } from '../shared/checklist-item.model';

@Component({
  selector: 'app-checklist-detail-content',
  host: { class: 'd-block' },
  template: `
    <main>
      <div class="wrapper">
        @for (item of checklistItems(); track item.id) {
          <div class="[ list-item ] [ cluster space-between ]">
            <span>
              @if (item.checked) {
                ✔️
              }
              {{ item.title }}
            </span>
            <div class="cluster">
              <button (click)="onToggleItem.emit(item.id)" data-size="small">
                Toggle
              </button>
              <button
                (click)="onEditItem.emit(item)"
                data-outline
                data-size="small"
              >
                Edit
              </button>
              <button
                (click)="onDeleteItem.emit(item.id)"
                data-outline
                data-severity="danger"
                data-size="small"
              >
                Delete
              </button>
            </div>
          </div>
        } @empty {
          <h2>Add an item</h2>
          <p>Click on "Add Item" to add a first item to this list.</p>
        }
      </div>
    </main>
  `,
})
export class ChecklistDetailContentComponent {
  checklistItems = input.required<ChecklistItem[]>();

  onEditItem = output<ChecklistItem>();
  onDeleteItem = output<ChecklistItemId>();
  onToggleItem = output<ChecklistItemId>();
}
