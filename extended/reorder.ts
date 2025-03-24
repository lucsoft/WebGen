export function reorderItemInArrayBasedOnIndex<T>(array: T[], sourceIndex: number, destinationIndex: number): T[] {
    const newArray = [ ...array ];
    // Remove the item from the source index and insert it at the destination index.
    newArray.splice(destinationIndex, 0, newArray.splice(sourceIndex, 1)[ 0 ]);
    return newArray;
}