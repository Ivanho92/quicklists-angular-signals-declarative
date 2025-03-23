import { computed, Injectable, signal } from '@angular/core';
import {
  AddChecklist,
  Checklist,
  ChecklistId,
  EditChecklist,
} from './checklist.model';
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
  edit$ = new Subject<EditChecklist>();
  delete$ = new Subject<ChecklistId>();
  reset$ = new Subject<ChecklistId>();

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

    this.edit$.pipe(takeUntilDestroyed()).subscribe((editChecklist) =>
      this.state.update((state) => ({
        ...state,
        checklists: this.state().checklists.map((checklist) =>
          checklist.id === editChecklist.id
            ? { ...checklist, ...editChecklist.data }
            : checklist,
        ),
      })),
    );

    this.delete$.pipe(takeUntilDestroyed()).subscribe((deleteChecklistId) =>
      this.state.update((state) => ({
        ...state,
        checklists: this.state().checklists.filter(
          (checklist) => checklist.id !== deleteChecklistId,
        ),
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
