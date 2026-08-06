// Global setup file for the vitest unit-test builder.
// The builder initializes the Angular TestBed (and loads zone.js via the build
// target's polyfills) before this file is executed.

// Patches vitest's describe/it/beforeEach to run inside zone.js ProxyZone,
// which is required for fakeAsync()/tick()/flush() to work.
import 'zone.js/plugins/vitest-patch';

import { getTestBed } from '@angular/core/testing';
import { provideZoneChangeDetection } from '@angular/core';

const testBed = getTestBed();

// Workaround for Angular 21+ where the test builder doesn't provide zone change detection
// We patch TestBed.configureTestingModule to always include provideZoneChangeDetection()
// unless it's already there or there's already a zone provider
const originalConfigureTestingModule = testBed.configureTestingModule;

testBed.configureTestingModule = function(moduleDef: any): any {
  if (!moduleDef) {
    moduleDef = {};
  }

  if (!moduleDef.providers) {
    moduleDef.providers = [];
  }

  // Check if provideZoneChangeDetection is already in the providers
  const hasZoneChangeDetection = moduleDef.providers.some((provider: any) => {
    if (!provider) return false;
    // Check if it's the provideZoneChangeDetection function
    return provider.ɵproviders || (typeof provider === 'function' && provider.toString().includes('provideZoneChangeDetection'));
  });

  // Add it if not already present
  if (!hasZoneChangeDetection) {
    moduleDef.providers.push(provideZoneChangeDetection());
  }

  return originalConfigureTestingModule.call(this, moduleDef);
};
