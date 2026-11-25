import type { Metadata } from 'next';
import { PolicyPage } from '@/components/legal/PolicyPage';

export const metadata: Metadata = { title: 'Returns & Refunds' };

export default function ReturnsPage() {
    return (
        <PolicyPage title="Returns & Refunds" updated="[Date]">
            <h2>Return window</h2>
            <p>[To be confirmed by the business: how many days customers have to request a return.]</p>

            <h2>Conditions</h2>
            <p>[To be confirmed by the business: condition the item must be in, and original packaging requirements.]</p>

            <h2>How to start a return</h2>
            <p>[To be confirmed by the business: the steps, and who to contact.]</p>

            <h2>Refunds and exchanges</h2>
            <p>[To be confirmed by the business: how refunds are paid, and how exchanges work.]</p>

            <h2>Custom and personalised pieces</h2>
            <p>[To be confirmed by the business: whether made-to-order or personalised pieces can be returned.]</p>
        </PolicyPage>
    );
}