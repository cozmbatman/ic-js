import { Canister } from "@dfinity/utils";
import { toNullable } from "@dfinity/utils/src";
import type { _SERVICE as IcrcIndexService } from "../candid/icrc1_index";
import type {
  Tokens,
  _SERVICE as IcrcLedgerService,
} from "../candid/icrc1_ledger";
import type { BalanceParams } from "./types/ledger.params";

export abstract class IcrcCanister<
  T extends IcrcLedgerService | IcrcIndexService
> extends Canister<T> {
  /**
   * Returns the balance for a given account provided as owner and with optional subaccount.
   *
   * @param {BalanceParams} params The parameters to get the balance of an account.
   * @returns {Promise<Tokens>} The balance of the given account.
   */
  balance = (params: BalanceParams): Promise<Tokens> =>
    this.caller({ certified: params.certified }).icrc1_balance_of({
      owner: params.owner,
      subaccount: toNullable(params.subaccount),
    });
}
