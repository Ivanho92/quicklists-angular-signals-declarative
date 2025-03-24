import {
  effect,
  inject,
  Injectable,
  linkedSignal,
  ResourceStatus,
} from '@angular/core';
import { AddChecklist, EditChecklist } from './checklist.model';
import { Subject } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ChecklistItemService } from './checklist-item.service';
import { ChecklistStorageService } from './checklist-storage.service';

@Injectable({ providedIn: 'root' })
export class ChecklistService {
  readonly #storageService = inject(ChecklistStorageService);
  readonly #checklistItemService = inject(ChecklistItemService);

  // Sources
  readonly #checklistsLoaded = this.#storageService.loadChecklists();
  readonly add$ = new Subject<AddChecklist>();
  readonly edit$ = new Subject<EditChecklist>();
  readonly delete$ = this.#checklistItemService.checklistRemoved$;

  // State
  readonly checklists = linkedSignal({
    source: this.#checklistsLoaded.value,
    computation: (checklists) => checklists ?? [],
  });

  constructor() {
    // Reducers
    this.add$
      .pipe(takeUntilDestroyed())
      .subscribe((addChecklist) =>
        this.checklists.update((checklists) => [
          ...checklists,
          this.#generateChecklistId(addChecklist),
        ]),
      );

    this.edit$
      .pipe(takeUntilDestroyed())
      .subscribe((editChecklist) =>
        this.checklists.update((checklists) =>
          checklists.map((checklist) =>
            checklist.id === editChecklist.id
              ? { ...checklist, ...editChecklist.data }
              : checklist,
          ),
        ),
      );

    this.delete$
      .pipe(takeUntilDestroyed())
      .subscribe((deleteChecklistId) =>
        this.checklists.update((checklists) =>
          checklists.filter((checklist) => checklist.id !== deleteChecklistId),
        ),
      );

    // effects
    effect(() => {
      if (this.#checklistsLoaded.status() === ResourceStatus.Resolved) {
        this.#storageService.saveChecklists(this.checklists());
      }
    });
  }

  readonly #generateChecklistId = (checklist: AddChecklist) => ({
    id: Date.now(),
    title: checklist.title,
  });
}
