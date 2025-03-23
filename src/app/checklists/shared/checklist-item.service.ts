import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  AddChecklistItem,
  ChecklistItem,
  ChecklistItemId,
  EditChecklistItem,
} from './checklist-item.model';
import { ChecklistId } from './checklist.model';
import { ChecklistStorageService } from './checklist-storage.service';

interface ChecklistItemsState {
  checklistItems: ChecklistItem[];
  loaded: boolean;
  error: string | null;
}

@Injectable({ providedIn: 'root' })
export class ChecklistItemService {
  readonly #storageService = inject(ChecklistStorageService);

  // State
  readonly #state = signal<ChecklistItemsState>({
    checklistItems: [],
    loaded: false,
    error: null,
  });

  // Selectors
  checklistItems = computed(() => this.#state().checklistItems);
  loaded = computed(() => this.#state().loaded);

  // Sources
  readonly #checklistItemsLoaded$ = this.#storageService.loadChecklistItems();
  readonly add$ = new Subject<AddChecklistItem>();
  readonly edit$ = new Subject<EditChecklistItem>();
  readonly delete$ = new Subject<ChecklistItemId>();
  readonly toggle$ = new Subject<ChecklistItemId>();
  readonly reset$ = new Subject<ChecklistId>();
  readonly checklistRemoved$ = new Subject<ChecklistId>();

  constructor() {
    // Reducers
    this.#checklistItemsLoaded$.pipe(takeUntilDestroyed()).subscribe({
      next: (checklistItems) =>
        this.#state.update((state) => ({
          ...state,
          checklistItems,
          loaded: true,
        })),
      error: (error) => this.#state.update((state) => ({ ...state, error })),
    });

    this.add$.pipe(takeUntilDestroyed()).subscribe((addChecklistItem) =>
      this.#state.update((state) => ({
        ...state,
        checklistItems: [
          ...state.checklistItems,
          {
            ...addChecklistItem.item,
            id: Date.now(),
            checklistId: addChecklistItem.checklistId,
            checked: false,
          },
        ],
      })),
    );

    this.edit$.pipe(takeUntilDestroyed()).subscribe((editChecklistItem) =>
      this.#state.update((state) => ({
        ...state,
        checklistItems: state.checklistItems.map((item) =>
          item.id === editChecklistItem.id
            ? {
                ...item,
                ...editChecklistItem.item,
              }
            : item,
        ),
      })),
    );

    this.delete$.pipe(takeUntilDestroyed()).subscribe((deleteItemId) =>
      this.#state.update((state) => ({
        ...state,
        checklistItems: state.checklistItems.filter(
          (item) => item.id !== deleteItemId,
        ),
      })),
    );

    this.toggle$.pipe(takeUntilDestroyed()).subscribe((toggleItemId) =>
      this.#state.update((state) => ({
        ...state,
        checklistItems: state.checklistItems.map((item) =>
          item.id === toggleItemId ? { ...item, checked: !item.checked } : item,
        ),
      })),
    );

    this.reset$.pipe(takeUntilDestroyed()).subscribe((resetChecklistId) =>
      this.#state.update((state) => ({
        ...state,
        checklistItems: state.checklistItems.map((item) =>
          item.checklistId === resetChecklistId
            ? { ...item, checked: false }
            : item,
        ),
      })),
    );

    this.checklistRemoved$
      .pipe(takeUntilDestroyed())
      .subscribe((removedDhecklistId) =>
        this.#state.update((state) => ({
          ...state,
          checklistItems: state.checklistItems.filter(
            (item) => item.checklistId !== removedDhecklistId,
          ),
        })),
      );

    // side effects
    effect(() => {
      if (this.loaded()) {
        this.#storageService.saveChecklistItems(this.checklistItems());
      }
    });
  }
}
