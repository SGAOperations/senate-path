export function getFullPath(path: string): string {
  return process.env.API_URL + path;
}
