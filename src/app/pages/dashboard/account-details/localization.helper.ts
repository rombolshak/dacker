import { OperationType } from '@app/models/operation.data';

export const operationTypeStringify = (type: OperationType): string => {
  switch (type) {
    case 'contribution':
      return 'Пополнение';
    case 'withdrawal':
      return 'Снятие';
    case 'interest':
      return 'Проценты';
    case 'commission':
      return 'Комиссия';
  }
};
