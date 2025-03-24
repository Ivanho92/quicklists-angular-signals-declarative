import {
  effect,
  inject,
  Injectable,
  linkedSignal,
  ResourceStatus,
} from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  AddChecklistItem,
  ChecklistItemId,
  EditChecklistItem,
} from './checklist-item.model';
import { ChecklistId } from './checklist.model';
import { ChecklistStorageService } from './checklist-storage.service';

@Injectable({ providedIn: 'root' })
export class ChecklistItemService {
  readonly #storageService = inject(ChecklistStorageService);

  // Sources
  readonly #checklistItemsLoaded = this.#storageService.loadChecklistItems();
  readonly add$ = new Subject<AddChecklistItem>();
  readonly edit$ = new Subject<EditChecklistItem>();
  readonly delete$ = new Subject<ChecklistItemId>();
  readonly toggle$ = new Subject<ChecklistItemId>();
  readonly reset$ = new Subject<ChecklistId>();
  readonly checklistRemoved$ = new Subject<ChecklistId>();

  // State
  readonly checklistItems = linkedSignal({
    source: this.#checklistItemsLoaded.value,
    computation: (checklistItems) => checklistItems ?? [],
  });

  constructor() {
    // Reducers
    this.add$.pipe(takeUntilDestroyed()).subscribe((addChecklistItem) =>
      this.checklistItems.update((items) => [
        ...items,
        {
          ...addChecklistItem.item,
          id: Date.now(),
          checklistId: addChecklistItem.checklistId,
          checked: false,
        },
      ]),
    );

    this.edit$.pipe(takeUntilDestroyed()).subscribe((editChecklistItem) =>
      this.checklistItems.update((items) =>
        items.map((item) =>
          item.id === editChecklistItem.id
            ? {
                ...item,
                ...editChecklistItem.item,
              }
            : item,
        ),
      ),
    );

    this.delete$
      .pipe(takeUntilDestroyed())
      .subscribe((deleteItemId) =>
        this.checklistItems.update((items) =>
          items.filter((item) => item.id !== deleteItemId),
        ),
      );

    this.toggle$
      .pipe(takeUntilDestroyed())
      .subscribe((toggleItemId) =>
        this.checklistItems.update((items) =>
          items.map((item) =>
            item.id === toggleItemId
              ? { ...item, checked: !item.checked }
              : item,
          ),
        ),
      );

    this.reset$
      .pipe(takeUntilDestroyed())
      .subscribe((resetChecklistId) =>
        this.checklistItems.update((items) =>
          items.map((item) =>
            item.checklistId === resetChecklistId
              ? { ...item, checked: false }
              : item,
          ),
        ),
      );

    this.checklistRemoved$
      .pipe(takeUntilDestroyed())
      .subscribe((removedDhecklistId) =>
        this.checklistItems.update((items) =>
          items.filter((item) => item.checklistId !== removedDhecklistId),
        ),
      );

    // side effects
    effect(() => {
      if (this.#checklistItemsLoaded.status() === ResourceStatus.Resolved) {
        this.#storageService.saveChecklistItems(this.checklistItems());
      }
    });
  }
}
