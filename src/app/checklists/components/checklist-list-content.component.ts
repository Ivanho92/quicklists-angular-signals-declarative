import { Component, input, output } from '@angular/core';
import { Checklist, ChecklistId } from '../shared/checklist.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-checklist-list-content',
  template: `
    <h2>Your checklists</h2>

    @for (checklist of checklists(); track checklist.id) {
      <div>
        <a [routerLink]="[checklist.id]">{{ checklist.title }}</a>
        <button (click)="onEditChecklist.emit(checklist)">Edit</button>
        <button (click)="onDeleteChecklist.emit(checklist.id)">Delete</button>
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
  imports: [
    RouterLink
  ]
})
export class ChecklistListContentComponent {
  checklists = input<Checklist[]>();

  onEditChecklist = output<Checklist>();
  onDeleteChecklist = output<ChecklistId>();
}
