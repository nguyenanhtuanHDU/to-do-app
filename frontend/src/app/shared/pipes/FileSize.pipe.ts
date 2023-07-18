import { Pipe, PipeTransform } from '@angular/core';
import { filesize } from 'filesize';

@Pipe({
  name: 'FileSize',
})
export class FileSize implements PipeTransform {
  transform(bytes: number) {
    return filesize(bytes, { round: 2 });
  }
}
