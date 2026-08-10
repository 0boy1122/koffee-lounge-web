-- Customer order tracking requires a secret token that is only returned when an order is created.
ALTER TABLE "Order" ADD COLUMN "trackingTokenHash" TEXT;

CREATE UNIQUE INDEX "Order_trackingTokenHash_key" ON "Order"("trackingTokenHash");
