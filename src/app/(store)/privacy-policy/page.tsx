import type { Metadata } from 'next';
import { PolicyPage } from '@/components/legal/PolicyPage';

export const metadata: Metadata = { title: 'Privacy Policy' };

export default function PrivacyPage() {
    return (
        <PolicyPage title="Privacy Policy" updated="[Date]">
            <p>
                [To be reviewed by a qualified professional before publishing. This is a placeholder, not legal advice.]
            </p>

            <h2>What we collect</h2>
            <p>[To be confirmed: the personal details collected at checkout, account sign-up, and the contact form.]</p>

            <h2>How we use it</h2>
            <p>[To be confirmed: order fulfilment, customer support, and any marketing, with the consent required.]</p>

            <h2>Who we share it with</h2>
            <p>[To be confirmed: delivery partners, payment providers, and hosting and analytics services.]</p>

            <h2>Your rights</h2>
            <p>[To be confirmed: how customers can access, correct, or delete their data.]</p>

            <h2>Contact</h2>
            <p>[To be confirmed: the contact details for privacy questions.]</p>
        </PolicyPage>
    );
}