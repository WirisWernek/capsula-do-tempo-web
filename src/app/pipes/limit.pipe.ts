import { Pipe, type PipeTransform } from '@angular/core';

@Pipe({
  name: 'limit',
})
export class LimitPipe implements PipeTransform {

  transform(value: string, tamanho: number, sufixo: boolean): unknown {
    return value?.toString().slice(0, tamanho) + (value?.length > tamanho ? (sufixo ? '...' : '') : '');
  }

}
