import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'as', pure: true, standalone: true })
export class AsPipe implements PipeTransform {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  transform<T>(input: unknown, baseItem: T | undefined): T {
    return input as unknown as T;
  }
}
