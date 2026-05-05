import { useControls } from 'leva';

/**
 * useCarControls — Leva panel for interactive McLaren P1 controls.
 * Returns an object with all user-configurable values.
 */
export function useCarControls() {
  return useControls('McLaren P1', {
    bodyColor: {
      value: '#FF4500',
      label: 'Body Color',
    },
    spoilerHeight: {
      value: 0,
      min: 0,
      max: 1,
      step: 0.01,
      label: 'Spoiler Height',
    },
    headlightsOn: {
      value: true,
      label: 'Headlights On',
    },
    rotateCar: {
      value: false,
      label: 'Rotate Car',
    },
    environment: {
      value: 'studio',
      options: ['studio', 'city', 'dawn', 'night'],
      label: 'Environment',
    },
  });
}
