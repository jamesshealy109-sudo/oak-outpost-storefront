# Moving from Fourthwall to dropshipping

The current site uses Fourthwall for the first few months, as instructed. No future supplier has been assumed or connected.

1. Select a supplier and confirm catalog access, variant/SKU mapping, real inventory, product image rights, delivery areas, rates, return policies, and fulfillment API support.
2. Select the payment and commerce backend. A fulfillment supplier does not replace a payment gateway, tax/shipping calculation, order records, receipts, or refunds.
3. Implement the `CommerceProvider` contract using the chosen commerce backend, with supplier-specific synchronization behind it. Persist product and variant mapping so storefront URLs can remain stable.
4. Route paid orders to fulfillment only after verified payment events. Add signature-checked webhooks, idempotency, retries, and alerts for rejected supplier orders. Reconcile cancellations/refunds with fulfillment state.
5. Decide whether existing Fourthwall customer/order data can and should be migrated. Use authorized export/API access; do not assume the public Storefront API exposes order histories.
6. Update customer policies, support, transactional emails, checkout branding, and analytics for the actual new operating model.
7. Test payment, order creation, fulfillment submission, tracking, cancellation, refunds, inventory failures, and duplicates before switching traffic.
8. Change the provider selection, deploy the exact tested source, and keep Fourthwall order access for orders still being fulfilled there.

The user interface is separated from provider request shapes. This reduces redesign work during migration; it does not remove the operational work of changing suppliers and payment systems.
