import { describe, it, expect } from 'vitest';
import { TweetCard, ReplyModal } from './icons.js';

describe('icons.js components', () => {
    describe('TweetCard', () => {
        it('should return a string containing the basic structure of a tweet card template', () => {
            const result = TweetCard();

            // Check if it returns a string
            expect(typeof result).toBe('string');

            // Check for key elements in the template
            expect(result).toContain('<template x-for="tweet in tweets" :key="tweet.id">');
            expect(result).toContain('x-data="{');
            expect(result).toContain('expanded: false,');
            expect(result).toContain('replies: tweet.replies_list || [],');
        });

        it('should contain retweet banner logic', () => {
            const result = TweetCard();
            expect(result).toContain('x-show="tweet.is_retweet"');
            expect(result).toContain('x-text="(tweet.retweeted_by || \'Someone\') + \' reposted\'"');
        });

        it('should contain user info bindings', () => {
            const result = TweetCard();
            expect(result).toContain(':src="tweet.avatar || \'https://i.pravatar.cc/150?u=\' + tweet.user_id"');
            expect(result).toContain('x-text="tweet.user?.name || tweet.user"');
            expect(result).toContain('x-text="tweet.handle ||');
        });

        it('should contain tweet body and time bindings', () => {
            const result = TweetCard();
            expect(result).toContain('x-text="tweet.body || tweet.content"');
            expect(result).toContain('x-text="tweet.time || tweet.created_at_human || \'now\'"');
        });
    });

    describe('ReplyModal', () => {
        it('should return a string containing the basic structure of a reply modal template', () => {
            const result = ReplyModal();

            // Check if it returns a string
            expect(typeof result).toBe('string');

            // Check for key elements in the template
            expect(result).toContain('x-data="{');
            expect(result).toContain('open: false,');
            expect(result).toContain('tweet: null,');
            expect(result).toContain('body: \'\',');
            expect(result).toContain('loading: false,');
            expect(result).toContain('submit() {');
        });

        it('should contain bindings for the original tweet preview', () => {
            const result = ReplyModal();
            expect(result).toContain('x-show="tweet"');
            expect(result).toContain(':src="tweet?.avatar || \'https://i.pravatar.cc/150?u=\' + tweet?.id"');
            expect(result).toContain('x-text="tweet?.user?.name || tweet?.user"');
            expect(result).toContain('x-text="tweet?.body || tweet?.content"');
        });

        it('should contain reply compose area bindings', () => {
            const result = ReplyModal();
            expect(result).toContain('x-model="body"');
            expect(result).toContain(':disabled="!body.trim() || loading || body.length > 280"');
            expect(result).toContain('x-text="loading ? \'Replying...\' : \'Reply\'"');
        });
    });
});
