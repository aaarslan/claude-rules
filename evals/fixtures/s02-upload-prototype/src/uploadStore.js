/**
 * Keeps chosen files for the life of the process. This is the seam a real
 * storage adapter slots into later; the screen only ever calls save and list.
 */
export function createUploadStore() {
  const files = [];
  let nextId = 1;

  return {
    /**
     * Record a file. `file` needs a name and a size; anything else on the
     * object is kept as-is so the screen can show its own extras.
     */
    save(file) {
      if (!file || typeof file.name !== 'string' || file.name === '') {
        throw new Error('a file needs a name');
      }

      const record = {
        id: `f-${nextId++}`,
        name: file.name,
        size: Number(file.size ?? 0),
        type: file.type ?? 'application/octet-stream',
        savedAt: Date.now()
      };

      files.push(record);
      return record;
    },

    /** Everything saved so far, newest last. */
    list() {
      return files.map((record) => ({ ...record }));
    }
  };
}

export const uploadStore = createUploadStore();
