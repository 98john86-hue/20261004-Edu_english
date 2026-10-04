import { afterEach, describe, expect, it, vi } from 'vitest';
import { DEFAULT_SETTINGS, loadSettings, parseSettings, saveSettings, SETTINGS_STORAGE_KEY } from './settings';

describe('parseSettings', () => {
  it('값이 없거나 깨졌으면 기본값', () => {
    expect(parseSettings(null)).toEqual(DEFAULT_SETTINGS);
    expect(parseSettings('{not json')).toEqual(DEFAULT_SETTINGS);
    expect(parseSettings('42')).toEqual(DEFAULT_SETTINGS);
  });

  it('범위를 벗어나거나 정수가 아니면 기본값으로 되돌린다', () => {
    expect(parseSettings('{"newWordsPerDay":-1}').newWordsPerDay).toBe(10);
    expect(parseSettings('{"newWordsPerDay":2.5}').newWordsPerDay).toBe(10);
    expect(parseSettings('{"newWordsPerDay":"20"}').newWordsPerDay).toBe(10);
    expect(parseSettings('{"newWordsPerDay":20}').newWordsPerDay).toBe(20);
  });
});

describe('loadSettings / saveSettings', () => {
  afterEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('localStorage에 저장하고 다시 읽는다', () => {
    expect(loadSettings()).toEqual(DEFAULT_SETTINGS);
    expect(saveSettings({ newWordsPerDay: 15 })).toBe(true);
    expect(JSON.parse(localStorage.getItem(SETTINGS_STORAGE_KEY) ?? '')).toEqual({ newWordsPerDay: 15 });
    expect(loadSettings()).toEqual({ newWordsPerDay: 15 });
  });

  it('저장소 접근이 막혀도 예외 없이 기본값/false를 돌려준다', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('SecurityError');
    });
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('QuotaExceededError');
    });
    expect(loadSettings()).toEqual(DEFAULT_SETTINGS);
    expect(saveSettings({ newWordsPerDay: 5 })).toBe(false);
  });
});
