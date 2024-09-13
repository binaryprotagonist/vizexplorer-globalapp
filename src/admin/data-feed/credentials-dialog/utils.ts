export function slotFeedEndpoint(orgId: string): string {
  return `${window.location.origin}/data_feed/new_data_available?database_name=data_feed_${orgId}`;
}
