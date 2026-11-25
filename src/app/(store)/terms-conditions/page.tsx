import type { Metadata } from 'next';
import { PolicyPage } from '@/components/legal/PolicyPage';

export const metadata: Metadata = { title: 'Terms & Conditions' };

export default function TermsPage() {
    return (
        <PolicyPage title="Terms & Conditions" updated="[Date]">
            <p>
                [To be reviewed by a qualified professional before publishing. This is a placeholder, not legal advice.]
            </p>

            <h2>Using this site</h2>
            <p>[To be confirmed: the rules for using the website and accounts.]</p>

            <h2>Orders and pricing</h2>
            <p>[To be confirmed: how orders are accepted, how prices are shown, and when payment is taken.]</p>

            <h2>Product information</h2>
            <p>[To be confirmed: how product descriptions, materials and images are presented, and any variation from the photos.]</p>

            <h2>Liability</h2>
            <p>[To be confirmed: the limits of liability the business is willing to state.]</p>

            <h2>Governing law</h2>
            <p>[To be confirmed: the jurisdiction whose law applies.]</p>
        </PolicyPage>
    );
}