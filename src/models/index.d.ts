import { ModelInit, MutableModel, __modelMeta__, ManagedIdentifier } from "@aws-amplify/datastore";
// @ts-ignore
import { LazyLoading, LazyLoadingDisabled } from "@aws-amplify/datastore";





type EagerUser = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<User, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly email: string;
  readonly collected_koroks: boolean[];
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyUser = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<User, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly email: string;
  readonly collected_koroks: boolean[];
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type User = LazyLoading extends LazyLoadingDisabled ? EagerUser : LazyUser

export declare const User: (new (init: ModelInit<User>) => User) & {
  copyOf(source: User, mutator: (draft: MutableModel<User>) => MutableModel<User> | void): User;
}

type EagerKorok = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Korok, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly korok_num: number;
  readonly pos_lat?: number | null;
  readonly pos_long?: number | null;
  readonly scan_history?: (string | null)[] | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyKorok = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Korok, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly korok_num: number;
  readonly pos_lat?: number | null;
  readonly pos_long?: number | null;
  readonly scan_history?: (string | null)[] | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type Korok = LazyLoading extends LazyLoadingDisabled ? EagerKorok : LazyKorok

export declare const Korok: (new (init: ModelInit<Korok>) => Korok) & {
  copyOf(source: Korok, mutator: (draft: MutableModel<Korok>) => MutableModel<Korok> | void): Korok;
}