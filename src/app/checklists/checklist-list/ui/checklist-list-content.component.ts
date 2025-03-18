import { Component, input, output } from '@angular/core';
import { Checklist } from '../../shared/checklist.model';

@Component({
  selector: 'app-checklist-list-content',
  template: `
    <h2>Your checklists</h2>

    @for (checklist of checklists(); track checklist.id) {
      <div>
        <span>{{ checklist.title }}</span>
        <button (click)="onEditChecklist.emit()">Edit</button>
        <button (click)="onDeleteChecklist.emit()">Delete</button>
      </div>
    } @empty {
      <div>No checklist yet. Create one now! :)</div>
    }
  `,
  styles: `
    :host {
      display: block;
    }
  `,
})
export class ChecklistListContentComponent {
  checklists = input<Checklist[]>();

  onEditChecklist = output();
  onDeleteChecklist = output();
}
