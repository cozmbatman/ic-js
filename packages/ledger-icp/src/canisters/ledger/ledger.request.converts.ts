import type { ICPTs, Subaccount } from "@dfinity/nns-proto";
import { arrayOfNumberToUint8Array, toNullable } from "@dfinity/utils";
import type {
  TransferArg as Icrc1TransferRawRequest,
  Tokens,
  TransferArgs as TransferRawRequest,
} from "../../../candid/ledger";
import { TRANSACTION_FEE } from "../../constants/constants";
import type {
  Icrc1TransferRequest,
  TransferRequest,
} from "../../types/ledger_converters";
import { importNnsProto } from "../../utils/proto.utils";

export const subAccountNumbersToSubaccount = async (
  subAccountNumbers: number[],
): Promise<Subaccount> => {
  const bytes = new Uint8Array(subAccountNumbers).buffer;
  const { Subaccount: SubaccountConstructor } = await importNnsProto();
  const subaccount: Subaccount = new SubaccountConstructor();
  subaccount.setSubAccount(new Uint8Array(bytes));
  return subaccount;
};

export const toICPTs = async (amount: bigint): Promise<ICPTs> => {
  const { ICPTs: ICPTsConstructor } = await importNnsProto();
  const result = new ICPTsConstructor();
  result.setE8s(amount.toString(10));
  return result;
};

const e8sToTokens = (e8s: bigint): Tokens => ({ e8s });

export const toTransferRawRequest = ({
  to,
  amount,
  memo,
  fee,
  fromSubAccount,
  createdAt,
}: TransferRequest): TransferRawRequest => ({
  to: to.toUint8Array(),
  fee: e8sToTokens(fee ?? TRANSACTION_FEE),
  amount: e8sToTokens(amount),
  // Always explicitly set the memo for compatibility with ledger wallet - hardware wallet
  memo: memo ?? BigInt(0),
  created_at_time:
    createdAt !== undefined ? [{ timestamp_nanos: createdAt }] : [],
  from_subaccount:
    fromSubAccount === undefined
      ? []
      : [arrayOfNumberToUint8Array(fromSubAccount)],
});

// WARNING: When using the ICRC-1 interface of the ICP ledger, there is no
// relationship between the memo and the icrc1Memo of a transaction. The ICRC-1
// interface simply cannot set the memo field and the non-ICRC-1 interface
// cannot set the icrc1Memo field, even though the icrc1Memo field is called
// just "memo" in canister method params.
export const toIcrc1TransferRawRequest = ({
  fromSubAccount,
  to,
  amount,
  fee,
  icrc1Memo,
  createdAt,
}: Icrc1TransferRequest): Icrc1TransferRawRequest => ({
  to,
  fee: toNullable(fee ?? TRANSACTION_FEE),
  amount,
  memo: toNullable(icrc1Memo),
  created_at_time: toNullable(createdAt),
  from_subaccount: toNullable(fromSubAccount),
});
