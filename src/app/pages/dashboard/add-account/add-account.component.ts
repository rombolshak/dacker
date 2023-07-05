import { ChangeDetectionStrategy, Component, Inject, Predicate } from '@angular/core';
import { CommonModule } from '@angular/common';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import {
  TuiButtonModule,
  TuiDataListModule,
  TuiDialogContext,
  TuiErrorModule,
  TuiGroupModule,
  TuiSvgModule,
} from '@taiga-ui/core';
import { AccountData, InterestBase, RepeatOption } from '@app/models/account.data';
import {
  TuiAvatarModule,
  TuiCheckboxBlockModule,
  TuiCheckboxLabeledModule,
  TuiComboBoxModule,
  TuiDataListWrapperModule,
  TuiFieldErrorPipeModule,
  TuiFilterByInputPipeModule,
  TuiInputDateModule,
  TuiInputModule,
  TuiInputNumberModule,
  TuiRadioBlockModule,
  TuiSelectModule,
  TuiStringifyContentPipeModule,
} from '@taiga-ui/kit';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { TuiActiveZoneModule, TuiAutoFocusModule, TuiDay, TuiLetModule, TuiMonth } from '@taiga-ui/cdk';
import { TuiTableModule } from '@taiga-ui/addon-table';
import { banks } from '@app/pages/dashboard/add-account/bank-list';

function conditionalValidator(predicate: Predicate<void>, validator: ValidatorFn): ValidatorFn {
  return (formControl: AbstractControl<any, any>) => {
    if (!formControl.parent) return null;
    if (predicate()) return validator(formControl);
    return null;
  };
}

@Component({
  selector: 'monitraks-add-account',
  standalone: true,
  imports: [
    CommonModule,
    TuiInputModule,
    TuiButtonModule,
    ReactiveFormsModule,
    TuiErrorModule,
    TuiFieldErrorPipeModule,
    TuiInputDateModule,
    TuiComboBoxModule,
    TuiDataListWrapperModule,
    TuiCheckboxLabeledModule,
    TuiInputNumberModule,
    TuiCheckboxBlockModule,
    TuiGroupModule,
    TuiTableModule,
    TuiLetModule,
    TuiAutoFocusModule,
    TuiActiveZoneModule,
    TuiSvgModule,
    TuiSelectModule,
    TuiStringifyContentPipeModule,
    TuiDataListModule,
    TuiRadioBlockModule,
    TuiFilterByInputPipeModule,
    TuiAvatarModule,
  ],
  templateUrl: './add-account.component.html',
  styleUrls: ['./add-account.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddAccountComponent {
  constructor(
    @Inject(POLYMORPHEUS_CONTEXT) private readonly context: TuiDialogContext<AccountData>,
    private readonly fb: NonNullableFormBuilder
  ) {
    const datesControls = this.accountForm.controls.dates.controls;
    datesControls.openedDate.valueChanges.subscribe(() => {
      datesControls.closingDate.setValue(null, { emitEvent: false });
      datesControls.durationDays.setValue(null, { emitEvent: false });
    });
    datesControls.closingDate.valueChanges.subscribe((date: TuiDay | null) => {
      datesControls.durationDays.setValue(
        date !== null ? TuiDay.lengthBetween(datesControls.openedDate.value, date) : null,
        { emitEvent: false }
      );
    });
    datesControls.durationDays.valueChanges.subscribe((duration: number | null) => {
      datesControls.closingDate.setValue(
        duration !== null ? datesControls.openedDate.value.append({ day: duration }) : null,
        { emitEvent: false }
      );
    });
    datesControls.isOpenEnded.valueChanges.subscribe((_: boolean) => {
      datesControls.closingDate.updateValueAndValidity({ emitEvent: false });
      datesControls.durationDays.updateValueAndValidity({ emitEvent: false });
    });

    const capitalizationControls = this.accountForm.controls.capitalization.controls;
    capitalizationControls.isEnabled.valueChanges.subscribe((_: boolean) => {
      capitalizationControls.repeatOption.updateValueAndValidity({ emitEvent: false });
      capitalizationControls.repeatDay.updateValueAndValidity({ emitEvent: false });
    });
    capitalizationControls.repeatOption.valueChanges.subscribe((_: number | null) => {
      capitalizationControls.repeatDay.updateValueAndValidity({ emitEvent: false });
    });
  }

  accountForm: any = this.fb.group({
    id: this.fb.control(''),
    name: this.fb.control('', Validators.required),
    bank: this.fb.control('', Validators.required),
    dates: this.fb.group({
      openedDate: this.fb.control<TuiDay>(TuiDay.currentLocal(), Validators.required),
      isOpenEnded: this.fb.control(false),
      closingDate: this.fb.control<TuiDay | null>(
        null,
        conditionalValidator(() => !this.accountForm.controls.dates.controls.isOpenEnded.value, Validators.required)
      ),
      durationDays: this.fb.control<number | null>(
        null,
        conditionalValidator(() => !this.accountForm.controls.dates.controls.isOpenEnded.value, Validators.required)
      ),
    }),
    interest: this.fb.group({
      monthSteps: this.fb.array([this.fb.control<number | null>({ value: 1, disabled: true }, Validators.required)]),
      moneySteps: this.fb.array([this.fb.control<number | null>({ value: 0, disabled: true }, Validators.required)]),
      rates: this.fb.array([this.fb.array([this.fb.control<number | null>(null, Validators.required)])]),
    }),
    canWithdraw: this.fb.control(false),
    canContribute: this.fb.control(false),
    capitalization: this.fb.group({
      isEnabled: this.fb.control(false),
      repeatOption: this.fb.control<RepeatOption | null>(
        null,
        conditionalValidator(
          () => this.accountForm.controls.capitalization.controls.isEnabled.value,
          Validators.required
        )
      ),
      repeatDay: this.fb.control<number | null>(
        null,
        conditionalValidator(
          () =>
            this.accountForm.controls.capitalization.controls.isEnabled.value &&
            this.accountForm.controls.capitalization.controls.repeatOption.value === 'monthly',
          Validators.required
        )
      ),
      basis: this.fb.control<InterestBase>('everyDay'),
    }),
  });

  banks = banks;

  readonly banksStringify = (item: { name: string }) => item.name ?? '';

  depositMaxDurationDays = 2000;
  openMinDate = TuiDay.currentLocal().append({ year: -2 });
  openMaxDate = TuiDay.currentLocal().append({ month: 1 });
  closingMaxDate = TuiDay.currentLocal().append({ day: this.depositMaxDurationDays });

  interestColumns = [
    'ranges',
    ...this.accountForm.controls.interest.getRawValue().monthSteps.map((month: number | null) => `month-${month}`),
  ];

  repeatOptions = ['monthly', 'quaterly', 'semiannual', 'annually'] as RepeatOption[];

  readonly getRepeatOptionContent = ($item: RepeatOption): string => {
    switch ($item) {
      case 'monthly':
        return 'Ежемесячно';
      case 'quaterly':
        return 'Ежеквартально';
      case 'semiannual':
        return 'Полугодично';
      case 'annually':
        return 'Ежегодно';
    }
  };

  readonly paydayStringify = (day: number): string => {
    if (day === 31) return 'Последний день месяца';
    if (day === this.accountForm.controls.dates.getRawValue().openedDate.day) return 'День открытия';
    return day.toString();
  };

  getMonthRangeHeader(index: number): string {
    const controls = this.accountForm.controls.interest.controls.monthSteps.controls;
    return this.getRangeHeader(controls, index, 'мес.');
  }

  getMoneyRangeHeader(index: number): string {
    const controls = this.accountForm.controls.interest.controls.moneySteps.controls;
    return this.getRangeHeader(controls, index, 'руб.');
  }

  addMonth() {
    const newMonth = this.fb.control<number | null>(null, Validators.required);
    const moneySteps = this.accountForm.controls.interest.controls.moneySteps.length;
    const rates = this.fb.array(
      Array.from({ length: moneySteps }, () => this.fb.control<number | null>(null, Validators.required))
    );

    this.accountForm.controls.interest.controls.rates.push(rates);
    this.accountForm.controls.interest.controls.monthSteps.push(newMonth);
    this.calculateInterestColumns();
  }

  removeMonth(index: number) {
    this.accountForm.controls.interest.controls.monthSteps.removeAt(index);
    this.accountForm.controls.interest.controls.rates.removeAt(index);
    this.calculateInterestColumns();
  }

  addMoney() {
    const newMoney = this.fb.control<number | null>(null, Validators.required);
    for (const ratesByMonth of this.accountForm.controls.interest.controls.rates.controls) {
      ratesByMonth.push(this.fb.control<number | null>(null, Validators.required));
    }

    this.accountForm.controls.interest.controls.moneySteps.push(newMoney);
  }

  removeMoney(index: number) {
    this.accountForm.controls.interest.controls.moneySteps.removeAt(index);
    for (const ratesByMonth of this.accountForm.controls.interest.controls.rates.controls) {
      ratesByMonth.removeAt(index);
    }
  }

  showEditControl(control: FormControl) {
    if (control.value !== 1 && control.value !== 0) control.enable();
  }

  closeEditControl(controlActive: boolean, monthControl: FormControl<number | null>) {
    if (!controlActive && monthControl.valid) {
      monthControl.disable();
    }
  }

  getRangeMin(controls: FormArray<FormControl<number | null>>, currentIndex: number): number {
    if (currentIndex === 0) return 1;
    const left = controls.at(currentIndex - 1).value;
    if (left === null) return Infinity;
    return left + 1;
  }

  getRangeMax(controls: FormArray<FormControl<number | null>>, currentIndex: number): number {
    if (currentIndex === 0) return 1;
    if (currentIndex === controls.length - 1) return Infinity;
    const right = controls.at(currentIndex + 1).value;
    if (right === null) return Infinity;
    return right - 1;
  }

  saveForm(): void {
    console.log(this.accountForm.getRawValue());
    this.context.completeWith(this.getModel());
  }

  close(): void {
    this.context.$implicit.complete();
  }

  private getModel(): AccountData {
    return {} as AccountData;
  }

  private getRangeHeader(controls: Array<FormControl<number | null>>, index: number, postfix: string): string {
    const currentStart = controls[index].value;
    if (currentStart === null) {
      return '???';
    }

    if (index === controls.length - 1) {
      return `${currentStart}+ ${postfix}`;
    }

    const nextStart = controls[index + 1].value;
    if (nextStart === null) {
      return `${currentStart} – ??? ${postfix}`;
    }

    if (currentStart + 1 === nextStart) {
      return `${currentStart} ${postfix}`;
    }

    return `${currentStart} – ${nextStart - 1} ${postfix}`;
  }

  private calculateInterestColumns() {
    this.interestColumns = [
      'ranges',
      ...this.accountForm.controls.interest.getRawValue().monthSteps.map((_: number | null, i: number) => `month-${i}`),
    ];
  }
}
