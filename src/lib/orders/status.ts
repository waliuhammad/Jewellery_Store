export const ORDER_STATUSES = [
  'awaiting_payment',
  'confirmed',
  'packed',
  'shipped',
  'delivered',
  'cancelled',
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  awaiting_payment: 'Awaiting payment',
  confirmed: 'Confirmed',
  packed: 'Packed',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

/** Staff can only move an order forward, or cancel it before it ships. Checked again on the server. */
export const ALLOWED_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  awaiting_payment: ['confirmed', 'cancelled'],
  confirmed: ['packed', 'cancelled'],
  packed: ['shipped', 'cancelled'],
  shipped: ['delivered'],
  delivered: [],
  cancelled: [],
};

export function labelFor(status: string): string {
  return ORDER_STATUS_LABEL[status as OrderStatus] ?? status;
}

export function canTransition(from: string, to: OrderStatus): boolean {
  return ALLOWED_TRANSITIONS[from as OrderStatus]?.includes(to) ?? false;
}
