export function profilePictureUrl(picture: { url?: string | null } | string | null | undefined): string {
  return typeof picture === 'string' ? picture : picture?.url ?? '';
}
