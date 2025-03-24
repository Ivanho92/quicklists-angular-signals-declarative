import { inject, Injectable, resource } from '@angular/core';
import { Checklist } from './checklist.model';
import { LOCAL_STORAGE } from '../../core/storage';
import { ChecklistItem } from './checklist-item.model';

@Injectable({
  providedIn: 'root',
})
export class ChecklistStorageService {
  storage = inject(LOCAL_STORAGE);

  readonly #CHECKLISTS_STORAGE_KEY = 'checklists';
  readonly #CHECKLIST_ITEMS_STORAGE_KEY = 'checklistItems';

  loadChecklists() {
    return resource({
      loader: async () => {
        const checklists = this.storage.getItem(this.#CHECKLISTS_STORAGE_KEY);
        return checklists ? (JSON.parse(checklists) as Checklist[]) : [];
      },
    });
  }

  loadChecklistItems() {
    return resource({
      loader: async () => {
        const checklistItems = this.storage.getItem(
          this.#CHECKLIST_ITEMS_STORAGE_KEY,
        );
        return checklistItems
          ? (JSON.parse(checklistItems) as ChecklistItem[])
          : [];
      },
    });
  }

  saveChecklists(checklists: Checklist[]) {
    this.storage.setItem(
      this.#CHECKLISTS_STORAGE_KEY,
      JSON.stringify(checklists),
    );
  }

  saveChecklistItems(checklistItems: ChecklistItem[]) {
    this.storage.setItem(
      this.#CHECKLIST_ITEMS_STORAGE_KEY,
      JSON.stringify(checklistItems),
    );
  }
}
