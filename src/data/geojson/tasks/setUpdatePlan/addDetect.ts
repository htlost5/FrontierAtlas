export function addDetect(buildIds: string[], localIds: string[]): string[] {
  const addList: string[] = buildIds.filter((id) => !localIds.includes(id));

  return addList;
}
