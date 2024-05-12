import type { ParallelStages } from '../planning';

export class ParallelStagesList {
  constructor(public readonly all: ParallelStages[]) {}

  public static empty(): ParallelStagesList {
    return new ParallelStagesList([]);
  }

  public static of(...stages: ParallelStages[]): ParallelStagesList {
    return new ParallelStagesList(stages);
  }

  public print() {
    return this.all.map((stages) => stages.print()).join(' THEN ');
  }

  public add(newParallelStages: ParallelStages): ParallelStagesList {
    const result = [...this.all, newParallelStages];

    return new ParallelStagesList(result);
  }
}
