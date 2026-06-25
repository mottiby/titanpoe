import { Badge } from "@/components/ui/badge";

type Variant = "neutral" | "primary" | "warning" | "info" | "success" | "destructive";

const statusVariant: Record<string, Variant> = {
  CREATED: "neutral",
  PAID: "primary",
  IN_PROGRESS: "warning",
  DELIVERED: "info",
  COMPLETED: "success",
  DISPUTED: "destructive",
  REFUNDED: "neutral",
  CANCELLED: "neutral",
};

/** Maps OrderStatus -> hue + label. `label` comes from i18n (Orders.status.*). */
export function OrderStatusBadge({
  status,
  label,
}: {
  status: string;
  label: string;
}) {
  return (
    <Badge variant={statusVariant[status] ?? "neutral"} dot>
      {label}
    </Badge>
  );
}
