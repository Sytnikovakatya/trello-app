import { ReorderService } from '../services/reorder.service';

const service = new ReorderService();
// PATTERN:Proxy
export const proxy = new Proxy(service, {
  get: (target, prop, receiver) => {
    const value = target[prop];
    if (value instanceof Function) {
      return function (...args: []) {
        console.log(`Calling method ${String(prop)} with arguments:`, args);
        return value.apply(this === receiver ? target : this, args);
      };
    }
    return value;
  }
});
