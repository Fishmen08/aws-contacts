import { ModelInit, MutableModel } from "@aws-amplify/datastore";

type ContactsMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

export declare class Contacts {
  readonly id: string;
  readonly name: string;
  readonly phoneNumber?: string | null;
  readonly email?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<Contacts, ContactsMetaData>);
  static copyOf(source: Contacts, mutator: (draft: MutableModel<Contacts, ContactsMetaData>) => MutableModel<Contacts, ContactsMetaData> | void): Contacts;
}