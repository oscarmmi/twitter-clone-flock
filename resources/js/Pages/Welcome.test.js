import { describe, it, expect } from 'vitest';
import Welcome from './Welcome.js';

describe('Welcome Page Component', () => {
    it('should return a string containing the HTML structure of the welcome page', () => {
        const mockProps = {
            auth: { user: null },
            tweets: [],
            trends: [],
            whoToFollow: [],
            pagination: { current_page: 1, has_more: false }
        };
        const result = Welcome(mockProps);

        expect(typeof result).toBe('string');
        expect(result).toContain('x-data="{');
        expect(result).toContain('activeTab: \'for-you\',');
    });

    it('should show the guest CTA banner for unauthenticated users', () => {
        const mockProps = {
            auth: { user: null },
            tweets: [],
            trends: [],
            whoToFollow: [],
            pagination: { current_page: 1, has_more: false }
        };
        const result = Welcome(mockProps);

        expect(result).toContain('<template x-if="!isLoggedIn">');
        expect(result).toContain('Join the conversation');
    });

    it('should show compose box and correctly serialize user data for authenticated users', () => {
        const mockProps = {
            auth: { user: { id: 1, name: 'Alice Doe' } },
            tweets: [],
            trends: [],
            whoToFollow: [],
            pagination: { current_page: 1, has_more: false }
        };
        const result = Welcome(mockProps);

        expect(result).toContain('isLoggedIn: true');
        expect(result).toContain('{&quot;name&quot;:&quot;Alice Doe&quot;');
        expect(result).toContain('<template x-if="isLoggedIn">');
        expect(result).toContain('What\'s happening?');
    });
});
