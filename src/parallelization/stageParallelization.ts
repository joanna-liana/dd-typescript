// import { Graph } from './graph';
import { ParallelStages } from '../planning';
import { ParallelStagesList } from './parallelStagesList';
import type { Stage } from './stage';

export const StageParallelization = {
  of(_stages: Set<Stage>): ParallelStagesList {
    const graph: Graph = {};

    const stages = Array.from(_stages);
    // populate graph
    stages.forEach((s) => stageToGraph(s, graph));

    const roots = findRoots(graph);

    const parallelStages = detectSameDepthNodes(graph, roots);

    const parallelStagesParsed: ParallelStages[] = Object.values(
      parallelStages,
    ).flatMap((parallel) => {
      const ss: Stage[] = parallel.map(
        (p) => stages.find((s) => s.name === p)!,
      );

      return new ParallelStages(ss);
    });

    return new ParallelStagesList(parallelStagesParsed);
  },
};

const stageToGraph = (stage: Stage, graph: Graph) => {
  if (!graph[stage.name]) {
    graph[stage.name] = [];
  }

  Array.from(stage.dependencies).forEach((dep) => {
    if (!graph[dep.name]) {
      graph[dep.name] = [];
    }

    graph[dep.name].push(stage.name);
  });
};

interface Graph {
  [node: string]: string[];
}

function findRoots(graph: Graph): string[] {
  const nodes = new Set<string>(Object.keys(graph));
  for (const sources of Object.values(graph)) {
    for (const source of sources) {
      nodes.delete(source);
    }
  }
  return Array.from(nodes);
}

function detectSameDepthNodes(
  graph: Graph,
  rootNodes: string[],
): { [depth: number]: string[] } {
  const depths: { [node: string]: number } = {};
  const nodesAtSameDepth: { [depth: number]: string[] } = {};

  // Initialize queue with root nodes
  const queue: [string, number][] = rootNodes.map((node) => [node, 0]);

  while (queue.length > 0) {
    const [node, depth] = queue.shift()!;
    depths[node] = depth;

    if (!nodesAtSameDepth[depth]) {
      nodesAtSameDepth[depth] = [];
    }
    nodesAtSameDepth[depth].push(node);

    for (const dependentNode of graph[node] || []) {
      if (!(dependentNode in depths)) {
        queue.push([dependentNode, depth + 1]);
      }
    }
  }

  return nodesAtSameDepth;
}
