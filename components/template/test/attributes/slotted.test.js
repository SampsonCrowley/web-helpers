/* eslint-disable no-unused-expressions */
import {
  html,
  fixture,
  expect,
} from '@open-wc/testing';

import '../../src/register-template-helper.js';

describe('Attributes', () => {
  describe('slotted', () => {
    it('Accepts Slots', async () => {
      const foo = 1;
      const el = await fixture(html`<template-helper><p>TEST</p></template-helper>`);
      expect(el).dom.to.equal('<template-helper><p>TEST</p></template-helper>', {
        ignoreAttributes: [ 'title' ]
      });
    });
  })
});
