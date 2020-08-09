export class PipelineBuilder {
    private pipeline: any[] = [];

    stage(stage: Object): PipelineBuilder {
        this.pipeline.push(stage);
        return this;
    }

    build(): any[] {
        return this.pipeline;
    }
}

// class StageBuilder {
//
//     addFields(stage: Stage): Stage {
//         return stage;
//     }
//
//     group(stage: Stage): Stage {
//         return stage;
//     }
// }

// interface Stage {
//     name: string;
//     commands: any;
// }
