import type { Metadata } from 'next';
import { PolicyPage } from '@/components/legal/PolicyPage';

export const metadata: Metadata = { title: 'Shipping & Delivery' };

export default function ShippingPage() {
    return (
        <PolicyPage title="Shipping & Delivery" updated="[Date]">
            <h2>Delivery areas</h2>
            <p>[To be confirmed by the business: where you deliver, and any areas you do not serve.]</p>

            <h2>Delivery times</h2>
            <p>[To be confirmed by the business: processing and delivery timeframes.]</p>

            <h2>Shipping costs</h2>
            <p>[To be confirmed by the business: how shipping is charged, and any free-shipping threshold.]</p>

            <h2>Tracking</h2>
            <p>[To be confirmed by the business: how and when customers receive tracking details.]</p>
        </PolicyPage>
    );
}