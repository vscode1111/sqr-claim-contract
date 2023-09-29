import { ClaimEvent } from '~typechain-types/contracts/SQRClaim';
import { ContextBase, EventArgs } from '~types';

type Fixture<T> = () => Promise<T>;

declare module 'mocha' {
  export interface Context extends ContextBase {
    loadFixture: <T>(fixture: Fixture<T>) => Promise<T>;
  }
}

export type ClaimEventArgs = ClaimEvent.Event & EventArgs<[string, string, number, number]>;
