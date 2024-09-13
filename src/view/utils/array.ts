export class ArrayUtils {
  static chunkCeil<T>(array: T[], size: number) {
    if (!array.length || size < 1) {
      return [];
    }

    return Array.from({ length: Math.ceil(array.length / size) }, (_, index) =>
      array.slice(index * size, index * size + size)
    );
  }

  static objDiff<T extends object>(arr1: T[], arr2: T[], id: keyof T): T[] {
    return arr1.filter((item1) => !arr2.some((item2) => item1[id] === item2[id]));
  }
}
