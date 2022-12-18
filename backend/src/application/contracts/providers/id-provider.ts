export enum NAMESPACES {
  USER_ACCESS_TOKEN = '8362ceda-699f-4f39-94e8-96ca0c2ac9da',
}

export interface IDProvider {
  generateV4: () => string;

  generateV5: (name: string, namespace: NAMESPACES) => string;
}
