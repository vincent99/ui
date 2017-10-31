import { helper } from '@ember/component/helper';
import Util from 'ui/utils/util';

export function formatMiB(params/*, options*/) {
  return Util.formatMiB(params[0]);
}

export default helper(formatMiB);
