export function deleteDetect(buildIds: string[], localIds: string[]): string[] {
  const deleteList: string[] = localIds.filter((id) => !buildIds.includes(id));

  return deleteList;
}
