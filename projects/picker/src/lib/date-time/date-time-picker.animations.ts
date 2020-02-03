import {
  animate,
  animateChild,
  AnimationTriggerMetadata,
  group,
  query,
  state,
  style,
  transition,
  trigger
} from '@angular/animations';

export const owlDateTimePickerAnimations: {
  readonly transformPicker: AnimationTriggerMetadata;
  readonly fadeInPicker: AnimationTriggerMetadata;
} = {
  transformPicker: trigger('transformPicker', [
    state('void', style({ opacity: 0, transform: 'scale(1, 0)' })),
    state('enter', style({ opacity: 1, transform: 'scale(1, 1)' })),
    transition(
      'void => enter',
      group([
        query('@fadeInPicker', animateChild(), { optional: true }),
        animate('400ms cubic-bezier(0.25, 0.8, 0.25, 1)')
      ])
    ),
    transition('enter => void', animate('100ms linear', style({ opacity: 0 })))
  ]),

  fadeInPicker: trigger('fadeInPicker', [
    state('enter', style({ opacity: 1 })),
    state('void', style({ opacity: 0 })),
    transition('void => enter', animate('400ms 100ms cubic-bezier(0.55, 0, 0.55, 0.2)'))
  ])
};
