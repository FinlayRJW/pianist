export interface SheetTimingMap {
  pages: SheetPage[];
  measures: SheetMeasure[];
}

export interface SheetPage {
  file: string;
  viewBox: [number, number];
  systems: SheetSystem[];
}

export interface SheetSystem {
  y: number;
  height: number;
  firstMeasure: number;
  measureCount: number;
  barlineXs?: number[];
}

export interface SheetMeasure {
  timeStart: number;
  timeEnd: number;
}
