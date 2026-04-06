import { describe, it, expect } from 'vitest';
import Search from './Search.js';

describe('Search Page Component', () => {
    it('should return a string containing the HTML structure of the search page', () => {
        const mockProps = {
            auth: { user: null },
            query: 'test',
            tweets: [],
            users: [],
            trends: []
        };
        const result = Search(mockProps);

        expect(typeof result).toBe('string');
        expect(result).toContain('x-data="{');
        expect(result).toContain('activeTab: \'people\',');
        expect(result).toContain('searchQuery: \'test\',');
    });

    it('should handle authenticated user props correctly', () => {
        const mockProps = {
            auth: { user: { id: 1, name: 'Test User' } },
            query: '',
            tweets: [],
            users: [],
            trends: []
        };
        const result = Search(mockProps);

        expect(result).toContain('isLoggedIn: true');
        expect(result).toContain('{&quot;name&quot;:&quot;Test User&quot;');
    });

    it('should render the no results state when query exists but no matches found', () => {
        const mockProps = {
            auth: { user: null },
            query: 'doesnotexist',
            tweets: [],
            users: [],
            trends: []
        };
        const result = Search(mockProps);

        expect(result).toContain('x-show="searchQuery && tweets.length === 0 && users.length === 0"');
        expect(result).toContain('No results for');
    });
});
