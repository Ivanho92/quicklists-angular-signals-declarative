import { inject, Injectable } from '@angular/core';
import { of } from 'rxjs';
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
    const checklists = this.storage.getItem(this.#CHECKLISTS_STORAGE_KEY);
    return of(checklists ? (JSON.parse(checklists) as Checklist[]) : []);
  }

  loadChecklistItems() {
    const checklistsItems = this.storage.getItem(
      this.#CHECKLIST_ITEMS_STORAGE_KEY,
    );
    return of(
      checklistsItems ? (JSON.parse(checklistsItems) as ChecklistItem[]) : [],
    );
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
