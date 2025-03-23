import { Component, output } from '@angular/core';

@Component({
  selector: 'app-checklist-list-header',
  host: { class: 'd-block' },
  template: `
    <header class="wrapper">
      <div class="cluster space-between">
        <h1>Quicklists</h1>
        <button (click)="onAddChecklist.emit()">Add Checklist</button>
      </div>
    </header>
  `,
})
export class ChecklistListHeaderComponent {
  onAddChecklist = output();
}
