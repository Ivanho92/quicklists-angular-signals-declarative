export interface Checklist {
  id: number;
  title: string;
}

export type AddChecklist = Omit<Checklist, 'id'>;

export type EditChecklist = {
  id: Checklist['id'];
  data: AddChecklist;
};

export type ChecklistId = Checklist['id'];
