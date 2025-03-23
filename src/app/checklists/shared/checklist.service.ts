import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { AddChecklist, Checklist, EditChecklist } from './checklist.model';
import { Subject } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { StorageService } from '../../core/storage.service';
import { ChecklistItemService } from './checklist-item.service';

interface ChecklistState {
  checklists: Checklist[];
  loaded: boolean;
  error: string | null;
}

@Injectable({ providedIn: 'root' })
export class ChecklistService {
  readonly #storageService = inject(StorageService);
  readonly #checklistItemService = inject(ChecklistItemService);

  // State
  readonly #state = signal<ChecklistState>({
    checklists: [],
    loaded: false,
    error: null,
  });

  // Selectors
  checklists = computed(() => this.#state().checklists);
  loaded = computed(() => this.#state().loaded);

  // Sources
  readonly #checklistsLoaded$ = this.#storageService.loadChecklists();
  readonly add$ = new Subject<AddChecklist>();
  readonly edit$ = new Subject<EditChecklist>();
  readonly delete$ = this.#checklistItemService.checklistRemoved$;

  constructor() {
    // Reducers
    this.#checklistsLoaded$.pipe(takeUntilDestroyed()).subscribe({
      next: (checklists) =>
        this.#state.update((state) => ({
          ...state,
          checklists,
          loaded: true,
        })),
      error: (error) => this.#state.update((state) => ({ ...state, error })),
    });

    this.add$.pipe(takeUntilDestroyed()).subscribe((addChecklist) =>
      this.#state.update((state) => ({
        ...state,
        checklists: [
          ...this.#state().checklists,
          this.#generateChecklistId(addChecklist),
        ],
      })),
    );

    this.edit$.pipe(takeUntilDestroyed()).subscribe((editChecklist) =>
      this.#state.update((state) => ({
        ...state,
        checklists: state.checklists.map((checklist) =>
          checklist.id === editChecklist.id
            ? { ...checklist, ...editChecklist.data }
            : checklist,
        ),
      })),
    );

    this.delete$.pipe(takeUntilDestroyed()).subscribe((deleteChecklistId) =>
      this.#state.update((state) => ({
        ...state,
        checklists: state.checklists.filter(
          (checklist) => checklist.id !== deleteChecklistId,
        ),
      })),
    );

    // effects
    effect(() => {
      if (this.loaded()) {
        this.#storageService.saveChecklists(this.checklists());
      }
    });
  }

  readonly #generateChecklistId = (checklist: AddChecklist) => ({
    id: Date.now(),
    title: checklist.title,
  });
}
