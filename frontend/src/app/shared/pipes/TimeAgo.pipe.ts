import { Pipe, PipeTransform } from '@angular/core';
import { formatDistanceToNow } from 'date-fns';

@Pipe({
  name: 'TimeAgo',
})
export class TimeAgo implements PipeTransform {
  transform(date: string) {
    return formatDistanceToNow(Date.parse(date));
  }
}
