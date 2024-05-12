import { type Duration } from 'date-fns';

type Requirement = {
  name: string;
  isMet: (context: unknown) => Promise<boolean>;
};

export class Stage {
  #resources: Set<ResourceName>;
  #duration: Duration;
  #requirements: Set<Requirement>;

  constructor(stageName: string);
  constructor(
    private readonly stageName: string,
    public readonly dependencies: Set<Stage> = new Set<Stage>(),
    resources?: Set<ResourceName>,
    duration?: Duration,
    requirements?: Set<Requirement>,
  ) {
    this.dependencies = dependencies ?? new Set<Stage>();
    this.#resources = resources ?? new Set<ResourceName>();
    this.#duration = duration ?? {};
    this.#requirements = requirements ?? new Set<Requirement>();
  }

  get name(): string {
    return this.stageName;
  }

  public dependsOn(stage: Stage): Stage {
    this.dependencies.add(stage);
    return this;
  }

  public equals(stage: Stage): boolean {
    return this.stageName === stage.stageName;
  }
}

export type ResourceName = Readonly<{ name: string }>;
