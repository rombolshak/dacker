import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { TuiButtonModule, TuiDialogContext, TuiErrorModule, TuiGroupModule, TuiSvgModule } from '@taiga-ui/core';
import { AccountData } from '@app/models/account.data';
import {
  TuiCheckboxBlockModule,
  TuiCheckboxLabeledModule,
  TuiComboBoxModule,
  TuiDataListWrapperModule,
  TuiFieldErrorPipeModule,
  TuiInputDateModule,
  TuiInputModule,
  TuiInputNumberModule,
} from '@taiga-ui/kit';
import {
  FormArray,
  FormBuilder,
  FormControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TuiActiveZoneModule, TuiAutoFocusModule, TuiDay, TuiLetModule, TuiMonth } from '@taiga-ui/cdk';
import { TuiTableModule } from '@taiga-ui/addon-table';

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
    datesControls.closingDate.valueChanges.subscribe(date => {
      datesControls.durationDays.setValue(
        date !== null ? TuiDay.lengthBetween(datesControls.openedDate.value, date) : null,
        { emitEvent: false }
      );
    });
    datesControls.durationDays.valueChanges.subscribe(duration => {
      datesControls.closingDate.setValue(
        duration !== null ? datesControls.openedDate.value.append({ day: duration }) : null,
        { emitEvent: false }
      );
    });
  }

  accountForm = this.fb.group({
    id: this.fb.control(''),
    name: this.fb.control('', Validators.required),
    bank: this.fb.group({
      name: this.fb.control('', Validators.required),
      icon: this.fb.control('', Validators.required),
    }),
    dates: this.fb.group({
      openedDate: this.fb.control<TuiDay>(TuiDay.currentLocal()),
      isOpenEnded: this.fb.control(false),
      closingDate: this.fb.control<TuiDay | null>(null),
      durationDays: this.fb.control<number | null>(null),
    }),
    interest: this.fb.group({
      monthSteps: this.fb.array([this.fb.control<number | null>({ value: 1, disabled: true }, Validators.required)]),
      moneySteps: this.fb.array([this.fb.control<number | null>({ value: 0, disabled: true }, Validators.required)]),
      rates: this.fb.array([this.fb.array([this.fb.control<number | null>(null, Validators.required)])]),
    }),
    canWithdraw: this.fb.control(false),
    canContribute: this.fb.control(false),
    interestIsCapitalized: this.fb.control(false),
  });

  banks = ['Сбер', 'ВТБ', 'Тинькофф'];

  depositMaxDurationDays = 2000;
  openMinDate = TuiDay.currentLocal().append({ year: -2 });
  openMaxDate = TuiDay.currentLocal().append({ month: 1 });
  closingMaxDate = TuiDay.currentLocal().append({ day: this.depositMaxDurationDays });

  interestColumns = [
    'ranges',
    ...this.accountForm.controls.interest.getRawValue().monthSteps.map(month => `month-${month}`),
  ];

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

  addMoney() {
    const newMoney = this.fb.control<number | null>(null, Validators.required);
    for (const ratesByMonth of this.accountForm.controls.interest.controls.rates.controls) {
      ratesByMonth.push(this.fb.control<number | null>(null, Validators.required));
    }

    this.accountForm.controls.interest.controls.moneySteps.push(newMoney);
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
      ...this.accountForm.controls.interest.getRawValue().monthSteps.map((_, i) => `month-${i}`),
    ];
  }
}
