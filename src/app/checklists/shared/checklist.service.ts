import { computed, Injectable, signal } from '@angular/core';
import { AddChecklist, Checklist } from './checklist.model';
import { Subject } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

interface ChecklistState {
  checklists: Checklist[];
}

@Injectable({ providedIn: 'root' })
export class ChecklistService {
  // State
  private readonly state = signal<ChecklistState>({
    checklists: [],
  });

  // Selectors
  checklists = computed(() => this.state().checklists);

  // Sources
  add$ = new Subject<AddChecklist>();

  constructor() {
    // Reducers
    this.add$.pipe(takeUntilDestroyed()).subscribe((addChecklist) =>
      this.state.update((state) => ({
        ...state,
        checklists: [
          ...this.state().checklists,
          this.generateChecklistId(addChecklist),
        ],
      })),
    );
  }

  private generateChecklistId(checklist: AddChecklist) {
    return {
      id: Date.now(),
      title: checklist.title,
    };
  }
}
