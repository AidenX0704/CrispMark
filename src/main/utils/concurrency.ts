/**
 * 批量并发执行任务，限制最大并发数
 * @param items 要处理的数据数组
 * @param worker 每个任务的处理函数
 * @param concurrency 最大并发数
 */
export async function runWithConcurrency<T, R>(
  items: T[],
  worker: (item: T, index: number) => Promise<R>,
  concurrency = 5
): Promise<R[]> {
  const results: R[] = [];
  let running = 0;
  let currentIndex = 0;

  return new Promise((resolve, reject) => {
    const runNext = () => {
      // 全部完成
      if (results.length === items.length) {
        resolve(results);
        return;
      }

      // 超过并发限制，暂停
      if (running >= concurrency) return;

      const index = currentIndex++;
      if (index >= items.length) return;

      running++;
      Promise.resolve(worker(items[index], index))
        .then((res) => {
          results[index] = res;
        })
        .catch((err) => reject(err))
        .finally(() => {
          running--;
          runNext();
        });

      runNext();
    };

    runNext();
  });
}
