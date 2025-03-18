import { Component, output } from '@angular/core';

@Component({
  selector: 'app-checklist-list-header',
  template: `
    <h1>Quicklists</h1>
    <button (click)="onAddChecklist.emit()">Add Checklist</button>
  `,
  styles: `
    :host {
      display: block;
    }
  `,
})
export class ChecklistListHeaderComponent {
  onAddChecklist = output();
}
