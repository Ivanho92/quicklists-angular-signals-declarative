import { Checklist } from './checklist.model';

export interface ChecklistItem {
  id: number;
  checklistId: number;
  title: string;
  checked: boolean;
}

export type AddChecklistItem = {
  item: Pick<ChecklistItem, 'title'>;
  checklistId: Checklist['id'];
};

export type EditChecklistItem = {
  id: ChecklistItem['id'];
  item: Pick<ChecklistItem, 'title'>;
};

export type ChecklistItemId = ChecklistItem['id'];
