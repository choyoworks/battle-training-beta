# ChoyoWorks Beta tank controller

This repository contains an original JavaScript controller for the [battle.training arena](https://battle.training/). The live bot is [choyoworks-beta](https://battle.training/bots/choyoworks-beta).

The strategy drafts two APCs, a scout, and an MBT where the rules permit it. It computes static routes to objectives and prioritizes weighted control points while engaging visible targets. The controller is experimental; a smoke test or a handful of practice results does not establish sustained ladder performance.

## Files

- `controller.js`: controller for Armor season 2.
- `smoke-test.cjs`: small offline checks using synthetic inputs. This is not the official simulator or a tournament benchmark.

Run the local smoke checks with `node smoke-test.cjs`. The arena uses its own isolated JavaScript runtime and rules; consult its official controller API for the current contract.

## Disclosure

This project was created with AI assistance and may be submitted to a battle.training promotional bounty that pays in USDC if accepted. No reward or endorsement is implied, and no payment has yet been received.

