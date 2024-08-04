declare module 'midtrans-client' {
  interface CoreApiOptions {
    isProduction: boolean;
    serverKey: string;
    clientKey: string;
  }

  interface SnapOptions {
    isProduction: boolean;
    serverKey: string;
    clientKey: string;
  }

  class CoreApi {
    constructor(options: CoreApiOptions);
    charge(parameter: any): Promise<any>;
    transaction: {
      status(orderId: string): Promise<any>;
      approve(orderId: string): Promise<any>;
      cancel(orderId: string): Promise<any>;
      expire(orderId: string): Promise<any>;
    };
  }

  class Snap {
    constructor(options: SnapOptions);
    createTransaction(parameter: any): Promise<any>;
    createTransactionToken(parameter: any): Promise<any>;
    createTransactionRedirectUrl(parameter: any): Promise<any>;
  }
}
