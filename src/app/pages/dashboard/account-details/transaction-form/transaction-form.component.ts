import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TuiDay } from '@taiga-ui/cdk';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { OperationData, OperationType } from '@app/models/operation.data';
import {
  TuiDataListWrapperModule,
  TuiInputDateModule,
  TuiInputModule,
  TuiInputNumberModule,
  TuiSelectModule,
  TuiStringifyContentPipeModule,
} from '@taiga-ui/kit';
import { TuiButtonModule, TuiTextfieldControllerModule } from '@taiga-ui/core';
import { firestoreAutoId } from '@app/models/identifiable';
import { Timestamp } from '@angular/fire/firestore';
import { operationTypeStringify } from '@app/pages/dashboard/account-details/localization.helper';
import { TuiCurrencyPipeModule } from '@taiga-ui/addon-commerce';

type ControlsOf<T> = FormGroup<{
  [K in keyof T]: FormControl<T[K]>;
}>;
export type TransactionFields = {
  date: TuiDay;
  amount: number | null;
  memo: string | null;
  id: string | null;
  type: OperationType | null;
};
type TransactionForm = ControlsOf<TransactionFields>;

@Component({
  selector: 'monitraks-transaction-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TuiInputDateModule,
    TuiSelectModule,
    TuiInputModule,
    TuiInputNumberModule,
    TuiButtonModule,
    TuiTextfieldControllerModule,
    TuiDataListWrapperModule,
    TuiStringifyContentPipeModule,
    TuiCurrencyPipeModule,
  ],
  templateUrl: './transaction-form.component.html',
  styleUrls: ['./transaction-form.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransactionFormComponent {
  @Output()
  public saved = new EventEmitter<TransactionFields>();

  @Output()
  public cancel = new EventEmitter();

  @Input()
  public set model(model: TransactionFields | null) {
    if (model !== null) {
      this.transactionForm.setValue(model);
    }
  }

  constructor(fb: FormBuilder) {
    this.transactionForm = fb.group({
      id: fb.control<string | null>(null),
      date: fb.nonNullable.control(TuiDay.currentLocal(), Validators.required),
      type: fb.control<OperationType | null>(null, Validators.required),
      amount: fb.control<number | null>(null, Validators.required),
      memo: fb.control<string | null>(null),
    });
  }

  public transactionForm: TransactionForm;
  operationTypes = ['contribution', 'withdrawal', 'interest', 'commission'] as OperationType[];
  operationTypeStringify = operationTypeStringify;

  public saveTransaction() {
    if (!this.transactionForm.valid) return;
    const formData = this.transactionForm.getRawValue() satisfies TransactionFields;
    this.transactionForm.reset();
    this.saved.emit(formData);
  }
}
