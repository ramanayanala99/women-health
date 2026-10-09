import assert from 'node:assert/strict';
import { test } from 'node:test';
import { conversationInstructions } from '../../netlify/lib/conversation-instructions.mjs';

test('prepared lesson instructions are unchanged outside dedicated conversation', () => {
  assert.equal(conversationInstructions({ purpose: 'classroom_detour' }), '');
  assert.equal(conversationInstructions({}), '');
});

test('dedicated conversation prioritizes the actual question and one spoken follow-up', () => {
  const prompt = conversationInstructions({ purpose: 'one_to_one_conversation', conversation_mode: 'spoken' });
  assert.match(prompt, /Answer the learner's actual question directly/);
  assert.match(prompt, /one relevant, easy follow-up question/);
  assert.match(prompt, /wait for the learner/);
  assert.match(prompt, /within 55 spoken words/);
  assert.match(prompt, /never claim to be a human teacher/i);
});
