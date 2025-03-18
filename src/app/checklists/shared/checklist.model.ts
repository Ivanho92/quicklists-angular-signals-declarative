export interface Checklist {
  id: number;
  title: string;
}

export type AddChecklist = Omit<Checklist, 'id'>;
