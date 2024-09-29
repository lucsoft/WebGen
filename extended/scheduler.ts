import { sortBy } from "jsr:@std/collections@^1.0.0";

export enum SchedulerPriority {
    Low = 2,
    Medium = 1,
    High = 0
}

export function createScheduler<T extends { priority: SchedulerPriority; }>() {
    let hasTask = Promise.withResolvers<void>();
    const queue: T[] = [];
    const scheduler = new ReadableStream<T>({
        pull: async (controller) => {
            if (queue.length === 0) {
                hasTask = Promise.withResolvers<void>();
                await hasTask.promise;
            }
            const task = sortBy(queue, it => it.priority)[ 0 ];
            controller.enqueue(task);
            queue.splice(queue.indexOf(task), 1);
        }
    });
    return {
        scheduler,
        add: (object: T) => {
            queue.push(object);
            hasTask.resolve();
        }
    };
}
