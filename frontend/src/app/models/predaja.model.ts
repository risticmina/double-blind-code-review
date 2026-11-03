export interface Predaja {
  _id: string;
  zadatakId: string;
  autorKorIme: string;
  kod: string;
  brojProslihTestova: number;
  bazniPoeni: number;
  finalnaOcena: number | null;
  datumPredaje: Date;
}
