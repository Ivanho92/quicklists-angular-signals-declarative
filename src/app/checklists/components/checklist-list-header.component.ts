import { Component, output } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-checklist-list-header',
  host: { class: 'd-block' },
  template: `
    <header class="wrapper">
      <div class="cluster space-between">
        <div class="cluster">
          <h1>Quicklists</h1>
          <a
            href="https://github.com/Ivanho92/quicklists-angular-signals-declarative"
            target="_blank"
            title="Go to Github"
          >
            <span class="visually-hidden">
              Go to the Github repository of this project.
            </span>
            <img ngSrc="/github-logo.svg" alt="" width="20" height="20" />
          </a>
        </div>
        <button (click)="onAddChecklist.emit()">Add Checklist</button>
      </div>
    </header>
  `,
  imports: [NgOptimizedImage],
})
export class ChecklistListHeaderComponent {
  onAddChecklist = output();
}
