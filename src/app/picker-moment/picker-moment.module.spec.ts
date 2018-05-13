import { PickerMomentModule } from './picker-moment.module';

describe('PickerMomentModule', () => {
  let pickerMomentModule: PickerMomentModule;

  beforeEach(() => {
    pickerMomentModule = new PickerMomentModule();
  });

  it('should create an instance', () => {
    expect(pickerMomentModule).toBeTruthy();
  });
});
