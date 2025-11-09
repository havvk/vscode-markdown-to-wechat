# Change Log

All notable changes to the "markdown-to-wechat" extension will be documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

## [Unreleased]

## [1.0.1] - 2025-11-09

### Fixed

- Resolved an incorrect line break issue within list items where text following a `<strong>` or `<em>` tag would be wrapped in a block-level element when pasted into the WeChat editor. This was fixed by inserting a `<span>` containing a zero-width non-joiner character (`&#8203;`) before the `<strong>`/`<em>` tag to provide a stable anchor for the editor's parser.
- Corrected an issue where several `unified.js` plugins were being invoked with incorrect syntax, causing the markdown conversion process to crash.

## [1.0.0] - Initial release
