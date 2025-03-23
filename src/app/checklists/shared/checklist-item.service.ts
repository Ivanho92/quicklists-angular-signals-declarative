import { computed, Injectable, signal } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  AddChecklistItem,
  ChecklistItem,
  ChecklistItemId,
  EditChecklistItem,
} from './checklist-item.model';
import { ChecklistId } from './checklist.model';

interface ChecklistItemsState {
  checklistItems: ChecklistItem[];
}

@Injectable({ providedIn: 'root' })
export class ChecklistItemService {
  // State
  private readonly state = signal<ChecklistItemsState>({
    checklistItems: [],
  });

  // Selectors
  checklistItems = computed(() => this.state().checklistItems);

  // Sources
  add$ = new Subject<AddChecklistItem>();
  edit$ = new Subject<EditChecklistItem>();
  delete$ = new Subject<ChecklistItemId>();
  toggle$ = new Subject<ChecklistItemId>();
  reset$ = new Subject<ChecklistId>();

  constructor() {
    // Reducers
    this.add$.pipe(takeUntilDestroyed()).subscribe((addChecklistItem) =>
      this.state.update((state) => ({
        ...state,
        checklistItems: [
          ...this.state().checklistItems,
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
      this.state.update((state) => ({
        ...state,
        checklistItems: this.state().checklistItems.map((item) =>
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
      this.state.update((state) => ({
        ...state,
        checklistItems: this.state().checklistItems.filter(
          (item) => item.id !== deleteItemId,
        ),
      })),
    );

    this.toggle$.pipe(takeUntilDestroyed()).subscribe((toggleItemId) =>
      this.state.update((state) => ({
        ...state,
        checklistItems: this.state().checklistItems.map((item) =>
          item.id === toggleItemId ? { ...item, checked: !item.checked } : item,
        ),
      })),
    );

    this.reset$.pipe(takeUntilDestroyed()).subscribe((resetChecklistId) =>
      this.state.update((state) => ({
        ...state,
        checklistItems: this.state().checklistItems.map((item) =>
          item.checklistId === resetChecklistId
            ? { ...item, checked: false }
            : item,
        ),
      })),
    );
  }
}
