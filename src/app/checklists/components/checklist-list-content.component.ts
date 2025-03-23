import { Component, input, output } from '@angular/core';
import { Checklist, ChecklistId } from '../shared/checklist.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-checklist-list-content',
  host: { class: 'd-block' },
  template: `
    <main>
      <div class="wrapper">
        <h2>Your checklists</h2>

        @for (checklist of checklists(); track checklist.id) {
          <div class="[ list-item ] [ cluster space-between ]">
            <a [routerLink]="[checklist.id]">{{ checklist.title }}</a>
            <div class="cluster">
              <button
                (click)="onEditChecklist.emit(checklist)"
                data-outline
                data-size="small"
              >
                Edit
              </button>
              <button
                (click)="onDeleteChecklist.emit(checklist.id)"
                data-severity="danger"
                data-outline
                data-size="small"
              >
                Delete
              </button>
            </div>
          </div>
        } @empty {
          <p>Click on "Add Checklist" to create your first checklist!</p>
        }
      </div>
    </main>
  `,
  imports: [RouterLink],
})
export class ChecklistListContentComponent {
  checklists = input<Checklist[]>();

  onEditChecklist = output<Checklist>();
  onDeleteChecklist = output<ChecklistId>();
}
