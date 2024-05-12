import { StageParallelization } from '../../../src/parallelization';
import { Stage } from '../../../src/parallelization/stage';

describe('Parallelization Test', () => {
  it('everything can be done in parallel when there are no dependencies', () => {
    //given
    const stage1 = new Stage('Stage1');
    const stage2 = new Stage('Stage2');

    //when
    const sortedStages = StageParallelization.of(new Set([stage1, stage2]));

    //then
    expect(sortedStages.all.length).toBe(1);
    expect(sortedStages.print()).toBe('Stage1, Stage2');
  });

  it('test simple dependencies', () => {
    //given
    const stage1 = new Stage('Stage1');
    const stage2 = new Stage('Stage2');
    const stage3 = new Stage('Stage3');
    const stage4 = new Stage('Stage4');
    stage2.dependsOn(stage1);
    stage3.dependsOn(stage1);
    stage4.dependsOn(stage2);

    //when
    const sortedStages = StageParallelization.of(
      new Set([stage1, stage2, stage3, stage4]),
    );

    //then
    expect(sortedStages.all.length).toBe(3);
    expect(sortedStages.print()).toBe('Stage1 THEN Stage2, Stage3 THEN Stage4');
  });

  it('cannot be done when there is a cycle ', () => {
    //given
    const stage1 = new Stage('Stage1');
    const stage2 = new Stage('Stage2');
    stage2.dependsOn(stage1);
    stage1.dependsOn(stage2); // making it cyclic

    //when
    const sortedStages = StageParallelization.of(new Set([stage1, stage2]));

    //then
    expect(sortedStages.all.length).toBe(0);
  });
});
